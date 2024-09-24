import { Suspense } from 'react';
<<<<<<< HEAD
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { useUserSession } from '@wanderlust/ui';
import { SideLayout } from './components/SideLayout/SideLayout';
import { TopLayout } from './components/TopLayout/TopLayout';
import Configure from './pages/Configure/Configure';
import configureRoutes from './pages/Configure/routes';
import Design from './pages/Design/Design';
import Play from './pages/Play/Play';
import { Welcome } from './pages/Welcome/Welcome';
import { LoginPage } from './pages/login/Login';

const ProtectedRoutes = () => {
  let { isLoggedIn } = useUserSession();
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: '/',
        element: <TopLayout />,
        children: [
          {
            path: 'welcome',
            element: <Welcome />,
          },
          {
            path: '*',
            element: <SideLayout />,
            children: [
              {
                path: 'configure',
                element: <Configure />,
                children: configureRoutes,
              },
              {
                path: 'create',
                element: <Design />,
              },
              {
                path: 'play',
                element: <Play />,
              },
            ],
          },
        ],
      },
=======
import { Layout } from './Layout';
import { routes as configureRoutes } from '@wanderlust/configure';
import { mediaRoutes } from '@wanderlust/media';
import { Welcome } from './pages/Welcome/Welcome';
import { LoginPage } from './pages/login/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'welcome',
        element: <Welcome />,
      },
      ...mediaRoutes,
      ...configureRoutes,
      // {
      //   path: 'library',
      //   children: libraryRoutes
      // },
      // {
      //   path: 'mixer',
      //   children: mixerRoutes
      // },
>>>>>>> cb21b1c (feat: auth with jwt)
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <Navigate to="login" />,
  },
]);

export function Router() {
  return (
    <Suspense fallback={'Loading...'}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
