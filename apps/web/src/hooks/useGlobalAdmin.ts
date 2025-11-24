import { useMutation, useQuery } from '@tanstack/react-query'
import { User } from '@wanderlust/core'
import { useEffect, useMemo, useRef, useState } from 'react'

export function useGlobalAdmin() {
    const creating = useRef(false)
    const [globalAdmin, setGlobalAdmin] = useState<User | null>(null)

    useEffect(() => {
        if (globalAdmin === null && !creating.current) {
            fetch('http://localhost:3000/api/users/global-admin')
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Global admin not found')
                    }
                    res.text().then((raw) => {
                        console.log(raw)
                        setGlobalAdmin(JSON.parse(raw))
                    })
                })
                .catch((error) => {
                    console.error('Error fetching global admin:', error)
                })
        }
    }, [globalAdmin])

    const { mutateAsync: createGlobalAdmin } = useMutation({
        mutationKey: ['create-global-admin', creating.current],
        mutationFn: async (admintDTO: Partial<User>) => {
            try {
                if (!creating.current) {
                    creating.current = true
                    const res = await fetch(
                        `${import.meta.env.VITE_USER_API_ENDPOINT}/global-admin`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(admintDTO),
                        }
                    )

                    if (!res.ok) {
                        creating.current = false
                        throw new Error('Failed to create global admin')
                    }
                    const raw = await res.text()
                    console.log('Global admin creation raw response:', raw)
                    const data: User = JSON.parse(raw)
                    setGlobalAdmin(data)
                    creating.current = false
                    return data
                }

                creating.current = false
                return null
            } catch (error) {
                console.error('Error creating global admin:', error)
                throw error
            }
        },
    })

    return useMemo(() => {
        return { globalAdmin, createGlobalAdmin }
    }, [globalAdmin, createGlobalAdmin])
}
