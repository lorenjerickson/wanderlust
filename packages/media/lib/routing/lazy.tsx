import { lazy } from "react";

export const MediaApp = lazy(() =>
  import("../pages/MediaApp/MediaApp").then((module) => ({
    default: module.MediaApp,
  }))
);

// export const AddMedia = lazy(() =>
//   import("./components/AddMedia").then((module) => ({
//     default: module.AddMedia,
//   }))
// );
