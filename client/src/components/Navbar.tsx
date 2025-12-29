import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { Bell, CircleUser } from "lucide-react";
import { RootState } from "../store/store";
import { useSocket } from "../hook/useSocket";
import { cn } from "../lib/utils";
import { setSidebar } from "../store/slices/sidebar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import userService from "../services/user.service";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.users.user);
  const { notifications, markAsReadAll, unreadNotifications } = useSocket(
    user?.userId || "",
  );
  const visible = useSelector((state: RootState) => state.sidebar);

  const queryClient = useQueryClient();

  // Fetching user data using React Query
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", user?.userId],
    queryFn: async () => userService.getUserById(user?.userId || ""),
    enabled: !!user?.userId, // Only run if userId is available
    staleTime: Infinity, // Prevent refetching unless necessary
  });

  const handleLogout = () => {
    // Clear user data and redirect to sign-in page
    queryClient.clear();
    dispatch(logout());
    navigate("/sign-in");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
  ];

  // console.log("Notifications", notifications);
  const handleReadAllNotifications = async () => {
    await markAsReadAll();
  };

  const handleSidebarClose = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    dispatch(setSidebar(false));
  };
  return (
    <div className="flex h-screen w-full flex-col">
      {/* Overlay for sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-30 hidden h-screen w-screen bg-black/30",
          visible && "block",
        )}
        onClick={handleSidebarClose}
      ></div>
      {/* Notification sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 z-[500] h-screen w-80 bg-neutral-100 transition-transform duration-300",
          visible ? "translate-x-0" : "translate-x-full",
        )}
      >
        <ul className="flex h-full w-full flex-col items-start justify-start gap-2 overflow-y-auto border-l border-neutral-300 bg-white p-4">
          <p className="w-full border-b-2 text-2xl font-bold text-neutral-700 shadow-sm">
            Nofifications
          </p>
          {notifications &&
            notifications.map((notification) => (
              <li
                key={notification.id}
                // onClick={() => markAsRead(notification.id)}
                className={`px-2 py-4 text-neutral-700 ${notification.isRead ? "bg-white" : "bg-gray-100"}`}
              >
                {notification.message}{" "}
                <span
                  className={`float-end ms-3 text-sm italic text-blue-300 ${notification.isRead ? "hidden" : ""}`}
                >
                  new
                </span>
              </li>
            ))}
        </ul>
      </div>
      <div className="sticky top-0 isolate z-20 flex h-20 w-full items-center justify-between border-b border-b-gray-100 bg-white px-5 py-3 shadow-sm">
        <div className="text-2xl font-bold text-neutral-700">TODO</div>
        <nav className="flex items-center gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `border-blue-300 px-3 py-1 hover:border-b-2 hover:text-blue-600 ${isActive ? "font-medium text-blue-600" : "text-gray-600"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-base text-red-600 hover:border-b-2 hover:border-red-300 hover:text-red-800"
          >
            Logout
          </button>
          <div
            className="relative cursor-pointer"
            onClick={() => dispatch(setSidebar(!visible))}
          >
            <p className="absolute -top-2 right-0 text-sm font-semibold text-blue-500">
              {unreadNotifications.length}
            </p>
            <Bell
              className="text-neutral-600"
              onClick={handleReadAllNotifications}
            />
          </div>
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => navigate("/profile")}
          >
            {userData?.profilePicUrl ? (
              <img
                src={new URL(
                  userData?.profilePicUrl,
                  process.env.REACT_APP_SERVER_URL,
                ).toString()}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <CircleUser className="text-gray-600" />
            )}
            <p>{userData?.username}</p>
          </div>
        </nav>
      </div>
      <Outlet />
    </div>
  );
};

export default Navbar;
