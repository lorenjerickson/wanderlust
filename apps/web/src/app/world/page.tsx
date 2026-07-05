import { redirect } from 'next/navigation'

import { WorldClient } from './WorldClient'
import { auth0 } from '@/lib/auth0'
import { findOneUserByExternalAuthSubject } from '@/server/user'

export default async function WorldPage() {
    const session = await auth0.getSession()

    if (!session) {
        redirect('/auth/login')
    }

    const externalAuthSubject = session.user.sub
    const currentUser = externalAuthSubject
        ? await findOneUserByExternalAuthSubject(externalAuthSubject)
        : null

    return <WorldClient isGm={currentUser?.isGm ?? false} />
}
