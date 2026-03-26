import React, { Children } from "react";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import { Navigate, useLocation } from "react-router";
import Loader from "../components/Shared/Loader";

const OrganizerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <Loader />;
  }

  if (!user || role !== "organizer") {
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden" replace />
    );
  }

  return children;
};

export default OrganizerRoute;
