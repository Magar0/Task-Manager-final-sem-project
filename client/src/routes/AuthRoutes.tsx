import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate, Outlet } from "react-router-dom";

export const AuthRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.users);
  return isAuthenticated ? <Navigate to={"/"} replace /> : <Outlet />;
};

export default AuthRoute;
