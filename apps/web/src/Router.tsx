import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import { Layout } from './Layout';

import { mediaRoutes } from '@wanderlust/media';
import { Welcome } from './pages/Welcome/Welcome';

console.log(mediaRoutes);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'welcome',
        element: <Welcome />
      },
      ...mediaRoutes,
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

