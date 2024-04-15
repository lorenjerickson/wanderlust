import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { lazy, Suspense } from 'react';
import { Layout } from './Layout';

import { mediaRoutes } from '@wanderlust/media';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'welcome',
        element: <HomePage />
      },
      {
        path: 'media',
        children: mediaRoutes
      },
      // {
      //   path: 'library',
      //   children: libraryRoutes
      // },
      // {
      //   path: 'mixer',
      //   children: mixerRoutes
      // },
      {
        path: "*", element: <Navigate to="welcome" />
      }
    ],
  },
]);

export function Router() {
  return (
    <Suspense fallback={"Loading..."}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

