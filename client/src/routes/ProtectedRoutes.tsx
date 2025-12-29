import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.users);
  console.log({ isAuthenticated });
  return isAuthenticated ? <Outlet /> : <Navigate to={"/sign-in"} replace />;
};

export default ProtectedRoutes;
