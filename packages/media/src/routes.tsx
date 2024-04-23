import { Navigate } from 'react-router-dom';
import { lazy } from 'react';

const MediaManager = lazy(() => import('./views/list/MediaList'));
const MediaEditor = lazy(() => import('./views/edit/MediaEdit'));

export const mediaRoutes = [{
    path: 'list',
    element: <MediaManager />
}, {
    path: 'edit/:id',
    element: <MediaEditor />
}, {
    path: '*', element: <Navigate to="list" />
}]
