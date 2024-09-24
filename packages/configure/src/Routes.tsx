import { RouteObject } from "react-router-dom"
import { Configure } from "./Configure"

export const routes: RouteObject[] = [
  {
    index: true,
    path: "/configure",
    element: <Configure />,
  },
]
