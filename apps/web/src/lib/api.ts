import { User } from '@wanderlust/core'

const fallbackUserApiEndpoint = 'http://localhost:3000/api/users'

export function getUserApiEndpoint() {
    return (
        process.env.NEXT_PUBLIC_USER_API_ENDPOINT ||
        process.env.USER_API_ENDPOINT ||
        fallbackUserApiEndpoint
    )
}

export async function getGlobalAdmin(): Promise<User | null> {
    try {
        const response = await fetch(`${getUserApiEndpoint()}/global-admin`, {
            cache: 'no-store',
        })

        if (!response.ok) {
            return null
        }

        return (await response.json()) as User
    } catch {
        return null
    }
}
