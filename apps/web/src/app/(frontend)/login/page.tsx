'use client'

import { Button, TextInput } from '@wanderlust/ui'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { useAuthentication } from '@/hooks/useAuthentication'

type FieldType = {
    username?: string
    password?: string
    remember?: boolean
}

export default function LoginPage() {
    const [error, setError] = useState<string | undefined>(undefined)
    const router = useRouter()
    const [values, setValues] = useState<FieldType>({
        username: '',
        password: '',
        remember: false,
    })
    const { login, isLoggedIn } = useAuthentication()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(undefined)
        const { username, password } = values
        if (!username || !password) {
            setError('Please enter a username and password')
            return
        }
        login({ username, password }).catch((error: unknown) => {
            console.error('Login failed', error)
            setError('Login failed')
        })
    }

    useEffect(() => {
        if (isLoggedIn) {
            router.push('/welcome')
        }
    }, [isLoggedIn, router])

    return (
        <div className="mx-auto my-[200px] flex flex-col items-center justify-center">
            <div className="text-11xl font-light">Wanderlust</div>
            <div className="mb-8 text-2xl font-light">Let the adventure begin.</div>
            <div className="flex w-card flex-col gap-4 p-6">
                <div className="mb-8">
                    <form
                        name="loginForm"
                        className="flex w-card flex-col gap-4 p-6"
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <TextInput
                            id="username"
                            name="username"
                            placeholder="Username"
                            onChange={handleChange}
                            label="Username"
                        />
                        <TextInput
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={handleChange}
                            label="Password"
                        />

                        <Button
                            variant="primary"
                            onClick={() => handleSubmit}
                            type="submit"
                            className="text-brand-black"
                        >
                            Login
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
