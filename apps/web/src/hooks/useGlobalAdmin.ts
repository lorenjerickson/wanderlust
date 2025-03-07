import { User } from '@wanderlust/core'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useGlobalAdmin() {
    const [globalAdmin, setGlobalAdmin] = useState<Partial<User> | undefined>(
        undefined
    )
    const navigate = useNavigate()

    useEffect(() => {
        fetch('http://localhost:3000/api/users/global-admin')
            .then((res) => {
                if (res.ok) {
                    res.json().then((data) => setGlobalAdmin(data))
                } else {
                    setGlobalAdmin(undefined)
                    navigate('/create-admin')
                }
            })
            .catch((err) => {
                console.error(err)
                setGlobalAdmin(undefined)
                navigate('/create-admin')
            })
    }, [])

    return useMemo(() => {
        const createGlobalAdmin = async (data: Partial<User>) => {
            const res = await fetch(
                'http://localhost:3000/api/users/global-admin',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            )

            return res.json()
        }

        return { hasGlobalAdmin: !!globalAdmin, createGlobalAdmin }
    }, [globalAdmin])
}
