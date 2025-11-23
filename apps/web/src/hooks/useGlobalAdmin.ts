import { useMutation, useQuery } from '@tanstack/react-query'
import { User } from '@wanderlust/core'
import { useMemo, useState } from 'react'

export function useGlobalAdmin() {
    const [saving, setSaving] = useState(false)

    const { data: globalAdmin, error } = useQuery({
        queryKey: ['global-admin', saving],
        queryFn: async () => {
            const res = await fetch(
                'http://localhost:3000/api/users/global-admin'
            )
            if (!res.ok) {
                throw new Error('Global admin not found')
            }
            return res.json()
        },
        enabled: saving,
    })

    const { mutateAsync: createGlobalAdmin } = useMutation({
        mutationKey: ['create-global-admin', saving],
        mutationFn: async (data: Partial<User>) => {
            if (!saving) {
                setSaving(() => true)
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

                if (!res.ok) {
                    setSaving(() => false)
                    throw new Error('Failed to create global admin')
                }
                setSaving(() => false)
                return res.json()
            }

            setSaving(() => false)  
            return null
        },
    })

    return useMemo(() => {
        return { hasGlobalAdmin: !!globalAdmin, createGlobalAdmin }
    }, [globalAdmin, saving])
}
