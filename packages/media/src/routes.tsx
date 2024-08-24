import { Navigate } from 'react-router-dom';
import { lazy } from 'react';
import { Layout } from './components/layout/Layout';

// const MediaManager = lazy(() => import('./views/list/MediaList'));
// const MediaEditor = lazy(() => import('./views/edit/MediaEdit'));

export const mediaRoutes = [{
    path: 'media', element: <Layout />,
    // children: [{
    //     path: 'assets', children: [{
    //         path: 'manage', element: <MediaManager />,
    //     }, {
    //         path: 'edit/:id', element: <MediaEditor />,
    //     },
    //     {
    //         path: '*', element: <Navigate to="manage" />,
    //     }],
    // }, {
    //     path: 'effects', children: [{
    //         path: 'animation', element: <Navigate to="manage" />,
    //     }],
    // }, {
    //     path: 'scenes', children: [{
    //         path: 'layers', element: <Navigate to="manage" />,
    //     }],
    // }]
}]
