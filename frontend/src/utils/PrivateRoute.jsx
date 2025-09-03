import { useAuth } from "./AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function PrivateRoute() {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading...</p>;

  if (!isLoggedIn) {
    console.log(location)
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
