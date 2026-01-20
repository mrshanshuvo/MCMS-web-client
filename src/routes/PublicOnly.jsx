import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";

const PublicOnly = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  // ✅ logged in → redirect away from auth pages
  if (user) {
    const redirectTo = location.state?.from || "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicOnly;
