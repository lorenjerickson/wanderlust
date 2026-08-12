import { notFound, redirect } from 'next/navigation'

import { WorldEditor } from '@/components/WorldEditor'
import { auth0 } from '@/lib/auth0'
import { findOneUserByExternalAuthSubject } from '@/server/user'
import { findWorldById } from '@/server/world'

export default async function WorldPage({
    params,
}: {
    params: Promise<{ worldId: string }>
}) {
    const session = await auth0.getSession()

    if (!session) {
        redirect('/auth/login')
    }

    const currentUser = session.user.sub
        ? await findOneUserByExternalAuthSubject(session.user.sub)
        : null

    if (!currentUser?.isGm) {
        redirect('/user')
    }

    const { worldId } = await params
    const world = await findWorldById(worldId)

    if (!world) {
        notFound()
    }

    if (world.ownerUserId !== currentUser._id) {
        notFound()
    }

    return <WorldEditor world={world} />
}
