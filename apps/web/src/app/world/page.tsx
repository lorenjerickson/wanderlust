import { redirect } from 'next/navigation'

import { WorldClient } from './WorldClient'
import { auth0 } from '@/lib/auth0'

export default async function WorldPage() {
    const session = await auth0.getSession()

    if (!session) {
        redirect('/auth/login')
    }

    return <WorldClient />
}
