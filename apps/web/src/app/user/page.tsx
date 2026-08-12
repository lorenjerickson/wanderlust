import { redirect } from 'next/navigation'

import { UserHome } from '@/components/UserHome/UserHome'
import { auth0 } from '@/lib/auth0'
import { findOneUserByExternalAuthSubject } from '@/server/user'
import {
    findCampaignsOwnedByUser,
    findWorldsOwnedByUser,
} from '@/server/userHome'

export default async function UserPage() {
    const session = await auth0.getSession()

    if (!session) {
        redirect('/auth/login')
    }

    const currentUser = session.user.sub
        ? await findOneUserByExternalAuthSubject(session.user.sub)
        : null

    if (!currentUser) {
        redirect('/login')
    }

    const [worlds, campaigns] = await Promise.all([
        findWorldsOwnedByUser(currentUser._id),
        findCampaignsOwnedByUser(currentUser._id),
    ])

    return (
        <UserHome
            user={{
                fullName: currentUser.fullName,
                username: currentUser.username,
                emailAddress: currentUser.emailAddress,
                phoneNumber: currentUser.phoneNumber,
                zipCode: currentUser.zipCode,
                isGm: currentUser.isGm,
            }}
            initialWorlds={worlds}
            initialCampaigns={campaigns}
        />
    )
}
