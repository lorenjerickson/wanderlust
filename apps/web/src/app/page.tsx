import { redirect } from 'next/navigation'

import { CreateAdminPage } from '@/components/CreateAdmin/CreateAdmin'
import { LoginPage } from '@/components/Login/Login'
import { auth0 } from '@/lib/auth0'
import { hasUserRecords } from '@/server/user'

function getString(value: unknown) {
    return typeof value === 'string' ? value : ''
}

export default async function HomePage() {
    const session = await auth0.getSession()

    if (!session) {
        return <LoginPage />
    }

    if (!(await hasUserRecords())) {
        const authUser = session.user as Record<string, unknown>
        const emailAddress = getString(authUser.email)
        const fullName = getString(authUser.name)
        const username =
            getString(authUser.nickname) ||
            emailAddress ||
            fullName ||
            getString(authUser.sub)

        return (
            <CreateAdminPage
                initialUser={{
                    username,
                    emailAddress,
                    fullName,
                    avatar: getString(authUser.picture),
                }}
            />
        )
    }

    redirect('/user')
}
