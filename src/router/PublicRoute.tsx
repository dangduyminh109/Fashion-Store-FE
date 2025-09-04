import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to={"/"} replace />;
  }
  return children;
};
