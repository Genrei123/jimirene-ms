import React from "react";
import { Navigate, RouteProps } from "react-router-dom";
import { useAuth } from "./../contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles: string[];
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, element }) => {
  const { userRole } = useAuth();

  if (!userRole || !allowedRoles.includes(userRole)) {
    // Redirect to login or home if not authorized
    return <Navigate to="/home" />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
