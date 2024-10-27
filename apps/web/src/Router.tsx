import { Suspense } from 'react'
import {
    Navigate,
    Outlet,
    RouterProvider,
    createBrowserRouter,
} from 'react-router-dom'

import { SideLayout } from './components/SideLayout/SideLayout'
import { TopLayout } from './components/TopLayout/TopLayout'
import Configure from './pages/Configure/Configure'
import configureRoutes from './pages/Configure/routes'
import Design from './pages/Design/Design'
import Play from './pages/Play/Play'
import { Welcome } from './pages/Welcome/Welcome'
import { LoginPage } from './pages/login/Login'
import { useUserSession } from './hooks/useUserSession'
import { useGlobalAdmin } from './hooks/useGlobalAdmin'
import { CreateAdminPage } from './pages/CreateAdmin/CreateAdmin'

const ProtectedRoutes = () => {
    let { isLoggedIn } = useUserSession()
    return isLoggedIn() ? <Outlet /> : <Navigate to="/" />
}

const StartupComponent = () => {
    let { isLoggedIn } = useUserSession()
    const { hasGlobalAdmin } = useGlobalAdmin()
    if (!hasGlobalAdmin) {
        return <CreateAdminPage />
    } else if (!isLoggedIn()) {
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
