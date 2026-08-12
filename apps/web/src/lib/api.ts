import { User } from '@wanderlust/common'

import { getGlobalAdmin as getSqliteGlobalAdmin } from '@web/server/user'

const fallbackUserApiEndpoint = 'http://localhost:3000/api/users'

export function getUserApiEndpoint() {
    return (
        process.env.NEXT_PUBLIC_USER_API_ENDPOINT ||
        process.env.USER_API_ENDPOINT ||
        fallbackUserApiEndpoint
    )
}

export async function getGlobalAdmin(): Promise<User | null> {
    return getSqliteGlobalAdmin()
}
