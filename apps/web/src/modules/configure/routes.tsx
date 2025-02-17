import { NotImplemented } from "@/ui/components";
import { RouteObject } from "react-router-dom";
import { ConfigureLayout } from "./components/Layout/Layout";


export const routes: RouteObject[] = [{
  path: 'configure',
  element: <ConfigureLayout />,
  children: [{
    path: 'system',
    element: <NotImplemented />,
  }, {
    path: 'security',
    element: <NotImplemented />,
  }, {
    path: 'users',
    element: <NotImplemented />,
  }, {
    path: 'modules',
    element: <NotImplemented />,
  }, {
    path: 'media',
    element: <NotImplemented />,
  }, {
    path: 'media',
    element: <NotImplemented />,
  }]
}]