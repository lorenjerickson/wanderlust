import { Navigate } from "react-router-dom";
import { Configure } from "./pages/Configure/Configure";

export const routes = [
  {
    path: "configure",
    element: <Configure />,
    chidlren: [
      {
        path: "overview",
        element: <h1>Overview</h1>,
      },
      {
        path: "users",
        element: <h1>Users</h1>,
      },
      {
        path: "systems",
        element: <h1>Game Systems</h1>,
      },
      {
        path: "worlds",
        element: <h1>Worlds</h1>,
      },
      {
        path: "admin",
        element: <h1>Admin</h1>,
      },
      {
        path: "modules",
        element: <h1>Modules</h1>,
      },
      {
        path: "*",
        element: <Navigate to="overview" />,
      },
    ],
  },
];
