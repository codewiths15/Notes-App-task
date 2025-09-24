import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "./protected-route";

// ----------------------------------------------------------------------

const NotesView = lazy(() =>
  import("../../components/notes/view/notes-main-view")
);

export const dashboardRoutes = [
  {
    path: "",
    element: (
      <ProtectedRoute>
        <Suspense>
          <Outlet />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "notes",
        children: [
          { element: <NotesView />, index: true },
          // { path: "tasks/:id", element: <TasksView /> },
        ],
      },
    ],
  },
];
