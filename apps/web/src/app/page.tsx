import { redirect } from 'next/navigation'

import { CreateAdminPage } from '@web/features/CreateAdmin/CreateAdmin'
import { LoginPage } from '@web/features/Login/Login'
import { getGlobalAdmin } from '@web/lib/api'
import { auth0 } from '@web/lib/auth0'

export default async function HomePage() {
    const [globalAdmin, session] = await Promise.all([
        getGlobalAdmin(),
        auth0.getSession(),
    ])

    if (!globalAdmin) {
        return <CreateAdminPage />
    }

    if (!session) {
        return <LoginPage />
    }

    redirect('/world')
}
