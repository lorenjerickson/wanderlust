'use client'

import { useGlobalAdmin } from '@web/hooks/useGlobalAdmin'
import { User } from '@wanderlust/core'
import { Button, Text, TextInput } from '@wanderlust/ui'
import { ChangeEvent, MouseEvent, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export function CreateAdminPage() {
    const router = useRouter()
    const [data, setData] = useState<
        Partial<User> & { confirmPassword: string }
    >({
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
            createGlobalAdmin(data).then(
                (response: User | null) => {
                    if (response?.emailAddress) {
                        router.push('/auth/login')
                    } else {
                        console.error('Failed to create global admin account')
                        setError('Unable to create user')
                    }
                    working.current = false
                }
            ).catch((err) => {  
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
        <main className="h-screen w-screen overflow-auto bg-neutral-900 px-6 py-10 text-slate-100">
            <form
                className="mx-auto grid w-full max-w-2xl gap-5"
                onSubmit={(event) => {
                    event.preventDefault()
                    handleSubmit()
                }}
            >
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
                        Wanderlust
                    </p>
                    <h1 className="mt-3 text-3xl font-bold text-white">
                        Global Admin Account
                    </h1>
                </div>
                <p className="text-sm leading-6 text-slate-300">
                The global admin account has full access to all areas of the
                Wanderlust application. Make sure to choose a secure, memorable
                password.
                </p>
                <TextInput
                    id="username"
                    name="username"
                    placeholder="Username"
                    className="input"
                    value={data.username}
                    onChange={handleChange}
                    required
                    label="Username"
                />

                <TextInput
                    id="fullName"
                    name="fullName"
                    className="input"
                    placeholder="Your full name"
                    value={data.fullName}
                    onChange={handleChange}
                    required
                    label="Full name"
                />

                <TextInput
                    name="phoneNumber"
                    placeholder="Your phone number"
                    className="input"
                    value={data.phoneNumber}
                    onChange={handleChange}
                    required
                    label="Phone number"
                />
                <TextInput
                    name="zipCode"
                    placeholder="Enter your zipcode"
                    className="input"
                    value={data.zipCode}
                    onChange={handleChange}
                    required
                    label="Zip code"
                />

                <TextInput
                    name="emailAddress"
                    className="input"
                    placeholder="Your email address"
                    value={data.emailAddress}
                    onChange={handleChange}
                    required
                    label="Email address"
                />

                <TextInput
                    type="password"
                    name="password"
                    className="input"
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
                    className="input"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    required
                    label="Confirm password"
                />

                {error && <Text className="text-red-300">{error}</Text>}

                <Button
                    className="button"
                    type="submit"
                    variant="primary"
                    onClick={handleClick}
                >
                    Create global admin
                </Button>
            </form>
        </main>
    )
}
