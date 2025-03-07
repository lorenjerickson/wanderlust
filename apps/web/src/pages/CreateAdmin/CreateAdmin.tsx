import { useGlobalAdmin } from '@web/hooks/useGlobalAdmin'
import { User } from '@wanderlust/core'
import { Button, Text, TextInput } from '@wanderlust/ui'
import { ChangeEvent, MouseEvent, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StyledCreateAdmin } from './CreateAdmin.styles'

export function CreateAdminPage() {
    const navigate = useNavigate()
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
                (response: { emailAddress: string }) => {
                    if (response.emailAddress) {
                        navigate('/login')
                    } else {
                        console.error('Failed to create global admin account')
                        setError('Unable to create user')
                    }
                    working.current = false
                }
            )
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
        <StyledCreateAdmin>
            <h1>Wanderlust</h1>
            <h2>Global Admin Account</h2>
            <p>
                The global admin account has full access to all areas of the
                Wanderlust application. Make sure to choose a secure, memorable
                password.
            </p>
            <p>Please create a global admin account to continue.</p>

            <form action="" className={`form`} onSubmit={handleSubmit}>
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

                {error && <Text className={`error`}>{error}</Text>}

                <Button
                    className={`button`}
                    type="submit"
                    variant="primary"
                    onClick={handleSubmit}
                >
                    Create global admin
                </Button>
            </form>
        </StyledCreateAdmin>
    )
}
