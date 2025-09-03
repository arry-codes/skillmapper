import { useAuth } from "./AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProfileAndLoginValidation() {
  const { isLoggedIn, loading,isProfileCompleted } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading...</p>;

  console.log("isLoggedIn:", isLoggedIn);
  console.log("isProfileCompleted:", isProfileCompleted);

  if (!isLoggedIn) {
    console.log(location.pathname)
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (loading) return <p>Loading..</p>

  if(isProfileCompleted === false){
    console.log(location.pathname)
    return <Navigate to ="/complete-profile" replace state = {{from:location}}/>
  }

  return <Outlet />;
}
