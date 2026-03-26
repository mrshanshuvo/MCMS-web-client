import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";
import Loader from "../components/Shared/Loader";

const PublicOnly = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  // ✅ logged in → redirect away from auth pages
  if (user) {
    const redirectTo = location.state?.from || "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicOnly;
