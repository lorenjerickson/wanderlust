import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const MediaManager = lazy(() => import('./views/manager/MediaManager'));
const MediaEditor = lazy(() => import('./views/editor/MediaEditor'));

export const mediaRoutes = [{
    path: 'manager',
    element: <MediaManager />
}, {
    path: 'editor',
    element: <MediaEditor />
}, {
    path: '*', element: <Navigate to="manager" />
}]
