import { User } from '@wanderlust/common'
import { useAtom, atom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'

const accessTokenAtom = atom('')

export function useAuthentication() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [accessToken, setAccessToken] = useAtom(accessTokenAtom)

    useEffect(() => {
        fetch('/auth/profile')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('User is not authenticated')
                }

                return response.json()
            })
            .then((profile) => {
                setIsAuthenticated(true)
                setUser(profile as User)
            })
            .catch(() => {
                setIsAuthenticated(false)
                setUser(null)
                setAccessToken('')
            })
    }, [setAccessToken])

    return useMemo(() => {
        const login = async () => {
            window.location.assign('/auth/login')
        }

        const logout = async () => {
            window.location.assign('/auth/logout')
        }

        const register = async () => {
            window.location.assign('/auth/login?screen_hint=signup')
        }

        return {
            isAuthenticated,
            user,
            accessToken,
            logout,
            login,
            register,
            isLoggedIn: isAuthenticated,
        }
    }, [isAuthenticated, user, accessToken])
}
