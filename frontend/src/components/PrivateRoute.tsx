import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loading } from "./Loading";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}; 