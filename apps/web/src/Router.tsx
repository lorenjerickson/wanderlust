import { lazy, Suspense } from 'react'
import {
    Navigate,
    Outlet,
    RouterProvider,
    createBrowserRouter,
} from 'react-router-dom'

import { ContentLayout } from './components/ContentLayout/ContentLayout'
import { TopLayout } from './components/TopLayout/TopLayout'
import { Welcome } from './pages/Welcome/Welcome'
import { LoginPage } from './pages/Login/Login'
import { useGlobalAdmin } from './hooks/useGlobalAdmin'
import { CreateAdminPage } from './pages/CreateAdmin/CreateAdmin'

import { routes as configureRoutes } from '@wanderlust/configure';
import { useAuthentication } from './hooks/useAuthentication'

const ProtectedRoutes = () => {
    let { isLoggedIn } = useAuthentication()
    return isLoggedIn ? <Outlet /> : <Navigate to="/" />
}

const StartupComponent = () => {
    let { isLoggedIn } = useAuthentication()
    const { globalAdmin } = useGlobalAdmin()
    if (!globalAdmin) {
        return <CreateAdminPage />
    } else if (!isLoggedIn) {
        return <LoginPage />
    } else {
        return <Navigate to="/welcome" />
    }
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <StartupComponent />,
    },
    {
        element: <ProtectedRoutes />,
        children: [
            {
                element: <TopLayout />,
                children: [
                    {
                        path: 'welcome',
                        element: <Welcome />,
                    },
                    {
                        element: <ContentLayout />,
                        children: [
                            {
                                path: 'configure',
                                children: configureRoutes,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <StartupComponent />,
    },
])

export function Router() {
    return (
        <Suspense fallback={'Loading...'}>
            <RouterProvider router={router} />
        </Suspense>
    )
}
