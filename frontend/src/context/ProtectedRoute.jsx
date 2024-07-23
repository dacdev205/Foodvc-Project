import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const { user, loading, isVerified } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (isVerified) {
    return children ? children : <Outlet />;
  }

  return <Navigate to="/verify/password" />;
};

export default ProtectedRoute;
