import { Navigate, useRoutes } from "react-router-dom";
import { authRoutes } from "./auth";
import { dashboardRoutes } from "./dashboard";
import { PATH_AFTER_LOGIN } from "../../config-global";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Default redirect to login
    { path: "/", element: <Navigate to={PATH_AFTER_LOGIN} replace /> },

    // Auth routes
    ...authRoutes,
    ...dashboardRoutes,

    // No match 404
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
