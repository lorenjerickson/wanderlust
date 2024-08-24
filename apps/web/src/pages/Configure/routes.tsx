import { lazy } from 'react';

const NotImplemented = lazy(() =>
  import('../../components/NotImplemented').then((module) => ({ default: module.NotImplemented }))
);
const Participants = lazy(() =>
  import('./pages/Participants/Participants').then((module) => ({ default: module.Participants }))
);
const Roles = lazy(() => import('./pages/Roles/Roles').then((module) => ({ default: module.Roles })));

const routes = [
  {
    path: 'participants',
    children: [{
      path: 'admins', 
      element: <Participants role="admins" />,
    },{
      path: 'admins', 
      element: <Participants role="gamemasters" />,
    },{
      path: 'admins', 
      element: <Participants role="players" />,
    },{
      path: 'admins', 
      element: <Participants role="spectators" />,
    }]
  },
  {
    path: 'roles',
    element: <Roles />,
  },
  {
    path: 'permissions',
    element: <NotImplemented />,
  },
  {
    path: 'game-systems',
    element: <NotImplemented />,
  },
  {
    path: 'modules',
    element: <NotImplemented />,
  },
  {
    path: 'theme',
    element: <NotImplemented />,
  },
  {
    path: 'settings',
    element: <NotImplemented />,
  },
];

export default routes;
