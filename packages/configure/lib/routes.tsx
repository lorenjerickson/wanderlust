import { SideNavLayout } from "@wanderlust/ui";
import { Navigate, RouteObject } from "react-router-dom";
import { Configure } from "./Configure";

export const routes: RouteObject[] = [
  {
    path: "configure",
    element: <SideNavLayout />,
    children: [
      {
        path: ":moduleName",
        element: <Configure />,
      },
      {
        path: "*",
        element: <Navigate to="general" />,
      },
    ],
  },
];
