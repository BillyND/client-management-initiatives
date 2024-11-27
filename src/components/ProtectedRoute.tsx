import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user } = useAuthStore();
  const isAllowed = user?.roles.some((role) => allowedRoles.includes(role));

  return isAllowed ? <>{children}</> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
