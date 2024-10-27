import {
    Anchor,
    Button,
    Group,
    PasswordInput,
    Text,
    TextInput,
} from '@mantine/core'
import { ChangeEvent, FormEvent, useRef, useState } from 'react'

import classes from './CreateAdmin.module.scss'
import { useNavigate } from 'react-router-dom'
import { useGlobalAdmin } from '@/hooks/useGlobalAdmin'
import { User } from '@wanderlust/core'

export function CreateAdminPage() {
    const navigate = useNavigate()
    const [data, setData] = useState<Partial<User>>({})
    const [error, setError] = useState<string | null>(null)
    const { createGlobalAdmin } = useGlobalAdmin()
    const working = useRef(false)

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null);
        if (!working.current) {
            working.current = true
            createGlobalAdmin(data).then((response) => {
                if (response.emailAddress) {
                    navigate('/login')
                } else {
                    console.error('Failed to create global admin account')
                    setError('Unable to create user')
                }
                working.current = false;
            })
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
        setData({
            ...data,
            [event.currentTarget.name]: event.currentTarget.value,
        })

    return (
        <div className={classes.createAdmin}>
            <h1>Wanderlust</h1>
            <h2>Global Admin Account</h2>
            <p>
                The global admin account has full access to all areas of the
                Wanderlust application. Make sure to choose a secure, memorable
                password.
            </p>
            <p>Please create a global admin account to continue.</p>

            <form action="" onSubmit={handleSubmit} className={classes.form}>
                <TextInput
                    name="fullName"
                    label="Full Name"
                    placeholder="Your full name"
                    classNames={classes}
                    value={data.fullName}
                    onChange={handleChange}
                    required
                />

                <TextInput
                    name="phoneNumber"
                    label="Phone"
                    placeholder="Your phone number"
                    classNames={classes}
                    value={data.phoneNumber}
                    onChange={handleChange}
                    required
                />

                <TextInput
                    name="zipCode"
                    label="Location"
                    placeholder="Enter your zipcode"
                    classNames={classes}
                    value={data.zipCode}
                    onChange={handleChange}
                    required
                />

                <TextInput
                    name="emailAddress"
                    label="Email address"
                    placeholder="Your email address"
                    classNames={classes}
                    value={data.emailAddress}
                    onChange={handleChange}
                    required
                />

                <PasswordInput
                    name="password"
                    placeholder="Your password"
                    label="Password"
                    id="your-password"
                    value={data.password}
                    onChange={handleChange}
                    className={classes.passwordInput}
                    required
                />

                <Button
                    fullWidth
                    className={classes.button}
                    type="submit"
                    variant="primary"
                >
                    Create global admin
                </Button>
                {error && <Text className={classes.error}>{error}</Text>}
            </form>
        </div>
    )
}
