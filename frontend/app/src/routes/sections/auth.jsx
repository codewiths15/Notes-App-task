import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";

// ----------------------------------------------------------------------

// Lazy imports
const LoginPage = lazy(() => import("../../components/auth/login-view"));

// ----------------------------------------------------------------------

const authJwt = {
  path: "",
  element: (
    <Suspense>
      <Outlet />
    </Suspense>
  ),
  children: [
    {
      path: "login",
      element: <LoginPage />,
    },
  ],
};

export const authRoutes = [
  {
    path: "auth",
    children: [authJwt],
  },
];
