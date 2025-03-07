import { RouteObject } from "react-router-dom";
import { MediaApp } from "./lazy";

export const routes: RouteObject[] = [
  {
    path: "media",
    element: <MediaApp />,
  },
];
