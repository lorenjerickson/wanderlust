import { User } from '@wanderlust/core'
import { useAtom, atom } from 'jotai'
import { useMemo, useState } from 'react'

const AUTH_API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT

const accessTokenAtom = atom('')

type LoginArgs = {
    username: string
    password: string
}

export function useAuthentication() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [accessToken, setAccessToken] = useAtom(accessTokenAtom)

    return useMemo(() => {
        const login = async ({ username, password }: LoginArgs) => {
            fetch(`${AUTH_API_ENDPOINT}/api/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.access_token) {
                        setIsAuthenticated(true)
                        setAccessToken(data.access_token)
                        setUser(data.user)
                    }
                })
        }

        const logout = async () => {}

        const register = async () => {}

        return {
            isAuthenticated,
            user,
            accessToken,
            logout,
            login,
            register,
            isLoggedIn: isAuthenticated,
        }
    }, [isAuthenticated, user, accessToken, isAuthenticated])
}
