'use client'

import { useGlobalAdmin } from '@/hooks/useGlobalAdmin'
import { User } from '@wanderlust/core'
import { Button, Text, TextInput } from '@wanderlust/ui'
import { ChangeEvent, MouseEvent, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateAdminPage() {
    const router = useRouter()
    const [data, setData] = useState<Partial<User> & { confirmPassword: string }>({
        fullName: '',
        phoneNumber: '',
        zipCode: '',
        emailAddress: '',
        password: '',
        username: '',
        confirmPassword: '',
    })
    const [error, setError] = useState<string | null>(null)
    const { createGlobalAdmin } = useGlobalAdmin()
    const working = useRef(false)

    const handleSubmit = () => {
        setError('')
        if (data.password !== data.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (!working.current) {
            working.current = true
            createGlobalAdmin(data)
                .then((response: User | null) => {
                    if (response?.emailAddress) {
                        router.push('/login')
                    } else {
                        console.error('Failed to create global admin account')
                        setError('Unable to create user')
                    }
                    working.current = false
                })
                .catch((err: any) => {
                    console.error('Error during global admin creation:', err)
                    setError(err.message || 'Unable to create user')
                    working.current = false
                })
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
        setData({
            ...data,
            [event.currentTarget.name]: event.currentTarget.value,
        })

    const handleClick = (e: MouseEvent) => {
        e.preventDefault()
        handleSubmit()
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <h1 className="mb-6 text-center text-3xl">Wanderlust</h1>
            <h2 className="mb-6 text-center text-2xl">Global Admin Account</h2>
            <p className="mx-auto mb-6 max-w-mobile-card text-center">
                The global admin account has full access to all areas of the Wanderlust
                application. Make sure to choose a secure, memorable password.
            </p>
            <p className="mx-auto mb-6 max-w-mobile-card text-center">
                Please create a global admin account to continue.
            </p>

            <form
                action=""
                className="relative flex w-mobile-card flex-col items-center justify-center"
                onSubmit={() => handleSubmit()}
            >
                <TextInput
                    id="username"
                    name="username"
                    placeholder="Username"
                    className="mb-2 w-full"
                    value={data.username}
                    onChange={handleChange}
                    required
                    label="Username"
                />

                <TextInput
                    id="fullName"
                    name="fullName"
                    className="mb-2 w-full"
                    placeholder="Your full name"
                    value={data.fullName}
                    onChange={handleChange}
                    required
                    label="Full name"
                />

                <TextInput
                    name="phoneNumber"
                    placeholder="Your phone number"
                    className="mb-2 w-full"
                    value={data.phoneNumber}
                    onChange={handleChange}
                    required
                    label="Phone number"
                />
                <TextInput
                    name="zipCode"
                    placeholder="Enter your zipcode"
                    className="mb-2 w-full"
                    value={data.zipCode}
                    onChange={handleChange}
                    required
                    label="Zip code"
                />

                <TextInput
                    name="emailAddress"
                    className="mb-2 w-full"
                    placeholder="Your email address"
                    value={data.emailAddress}
                    onChange={handleChange}
                    required
                    label="Email address"
                />

                <TextInput
                    type="password"
                    name="password"
                    className="mb-2 w-full"
                    placeholder="Your password"
                    id="password"
                    value={data.password}
                    onChange={handleChange}
                    required
                    label="Password"
                />

                <TextInput
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    id="confirmPassword"
                    className="mb-2 w-full"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    required
                    label="Confirm password"
                />

                {error && <Text className="text-red-500">{error}</Text>}

                <Button
                    className="mt-5 w-full"
                    type="submit"
                    variant="primary"
                    onClick={() => handleSubmit()}
                >
                    Create global admin
                </Button>
            </form>
        </div>
    )
}
