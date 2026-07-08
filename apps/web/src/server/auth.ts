'use server'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { getDb } from '@web/lib/db'
import { findOneUserByUsername } from './user'

export type AuthRecord = {
    username: string
    jwt: string
}

type AuthenticateArgs = {
    username: string
    password: string
}

export async function authenticate({ username, password }: AuthenticateArgs): Promise<AuthRecord> {
    const user = await findOneUserByUsername(username)

    if (!user?.password) {
        throw new Error('Unauthorized')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw new Error('Unauthorized')
    }

    const secret = process.env.JWT_SECRET ?? process.env.AUTH0_SECRET ?? 'wanderlust-local-secret'
    const token = jwt.sign({ sub: user.username, user }, secret)
    const db = await getDb()

    await db.run(
        `
            INSERT INTO auth (username, jwt)
            VALUES (?, ?)
            ON CONFLICT(username) DO UPDATE SET
                jwt = excluded.jwt,
                createdOn = CURRENT_TIMESTAMP
        `,
        username,
        token
    )

    return {
        username,
        jwt: token,
    }
}

export async function deauthenticate(username: string): Promise<AuthRecord | null> {
    const db = await getDb()
    const record = await db.get<AuthRecord>(
        'SELECT username, jwt FROM auth WHERE username = ?',
        username
    )

    await db.run('DELETE FROM auth WHERE username = ?', username)

    return record ?? null
}
