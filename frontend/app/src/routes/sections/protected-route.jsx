import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { paths } from "../paths";

const ProtectedRoute = ({ children }) => {
  const isLogged = localStorage.getItem("isLogged") === "true";
  const token = localStorage.getItem("token");

  if (!isLogged || !token) {
    return <Navigate to={paths.auth.login} replace />;
  }

  try {
    // Decode token
    const decoded = jwtDecode(token);

    // Check expiration
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("isLogged");
      return <Navigate to="/login" replace />;
    }

    // Check role is present
    if (!decoded.email) {
      return <Navigate to={paths.auth.login} replace />;
    }

    // ✅ All good → render the child routes
    return children;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("isLogged");
    return <Navigate to={paths.auth.login} replace />;
  }
};

export default ProtectedRoute;
