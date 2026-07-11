'use client'

import { createFirstGameMaster } from '@/server/user'
import { User } from '@/core/types/user'
import { Button, Text, TextInput } from '@/core/components'
import { ChangeEvent, MouseEvent, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type CreateAdminPageProps = {
    initialUser?: Partial<
        Pick<
            User,
            | 'username'
            | 'fullName'
            | 'phoneNumber'
            | 'zipCode'
            | 'emailAddress'
            | 'avatar'
        >
    >
}

export function CreateAdminPage({ initialUser = {} }: CreateAdminPageProps) {
    const router = useRouter()
    const [data, setData] = useState<Partial<User>>({
        fullName: initialUser.fullName ?? '',
        phoneNumber: initialUser.phoneNumber ?? '',
        zipCode: initialUser.zipCode ?? '',
        emailAddress: initialUser.emailAddress ?? '',
        username: initialUser.username ?? '',
        avatar: initialUser.avatar,
    })
    const [error, setError] = useState<string | null>(null)
    const working = useRef(false)

    const handleSubmit = () => {
        setError('')

        if (!working.current) {
            working.current = true
            createFirstGameMaster(data)
                .then((response: User | null) => {
                    if (response?.emailAddress) {
                        router.replace('/user')
                        router.refresh()
                    } else {
                        console.error('Failed to create GM profile')
                        setError('Unable to create user')
                    }
                    working.current = false
                })
                .catch((err) => {
                    console.error('Error during GM profile creation:', err)
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
                        Game Master Profile
                    </h1>
                </div>
                <p className="text-sm leading-6 text-slate-300">
                    You are the first person to log in, so Wanderlust will mark
                    this profile as the GM for the table. Your sign-in stays
                    with Auth0; this only fills in your in-game profile details.
                </p>
                <TextInput
                    id="username"
                    name="username"
                    placeholder="Username"
                    className="input"
                    value={data.username ?? ''}
                    onChange={handleChange}
                    required
                    label="Username"
                />

                <TextInput
                    id="fullName"
                    name="fullName"
                    className="input"
                    placeholder="Your full name"
                    value={data.fullName ?? ''}
                    onChange={handleChange}
                    required
                    label="Full name"
                />

                <TextInput
                    name="phoneNumber"
                    placeholder="Your phone number"
                    className="input"
                    value={data.phoneNumber ?? ''}
                    onChange={handleChange}
                    required
                    label="Phone number"
                />
                <TextInput
                    name="zipCode"
                    placeholder="Enter your zipcode"
                    className="input"
                    value={data.zipCode ?? ''}
                    onChange={handleChange}
                    required
                    label="Zip code"
                />

                <TextInput
                    name="emailAddress"
                    className="input"
                    placeholder="Your email address"
                    value={data.emailAddress ?? ''}
                    onChange={handleChange}
                    required
                    label="Email address"
                />

                {error && <Text className="text-red-300">{error}</Text>}

                <Button
                    className="button"
                    type="submit"
                    variant="primary"
                    onClick={handleClick}
                >
                    Create GM profile
                </Button>
            </form>
        </main>
    )
}
