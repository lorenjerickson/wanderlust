import { useUserSession } from '@web/hooks/useUserSession'
import { Button, TextInput } from '@wanderlust/ui'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import classes from './Login.module.scss'

type FieldType = {
    username?: string
    password?: string
    remember?: boolean
}

export const LoginPage = () => {
    const { startUserSession } = useUserSession()
    const [error, setError] = useState<string | undefined>(undefined)
    const navigate = useNavigate()
    const [values, setValues] = useState<FieldType>({
        username: '',
        password: '',
        remember: false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(undefined)
        startUserSession(values)
            .then(() => {
                navigate('/welcome')
            })
            .catch((error: unknown) => {
                console.error('Login failed', error)
                setError('Login failed')
            })
    }

    return (
        <div className={classes.page}>
            <div className={classes.title}>Wanderlust</div>
            <div className={classes.subtitle}>Let the adventure begin.</div>
            <div className={classes.form}>
                <div className={classes.login}>
                    <form
                        name="loginForm"
                        style={{ maxWidth: 800 }}
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <TextInput
                            id="filled-basic"
                            name="username"
                            placeholder="Username"
                            onChange={handleChange}
                            label="Username"
                        />
                        <TextInput
                            id="filled-basic"
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
                        >
                            Login
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
