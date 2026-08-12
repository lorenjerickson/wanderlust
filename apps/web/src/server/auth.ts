'use server'

import bcrypt from 'bcrypt'
import { eq, sql } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

import { auth } from '@web/lib/db/schema'
import { getDrizzleDb } from '@web/lib/drizzle'
import { findOneUserByUsername } from './user'

export type AuthRecord = {
    username: string
    jwt: string
}

type AuthenticateArgs = {
    username: string
    password: string
}

export async function authenticate({
    username,
    password,
}: AuthenticateArgs): Promise<AuthRecord> {
    const user = await findOneUserByUsername(username)

    if (!user?.password) {
        throw new Error('Unauthorized')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw new Error('Unauthorized')
    }

    const secret =
        process.env.JWT_SECRET ??
        process.env.AUTH0_SECRET ??
        'wanderlust-local-secret'
    const token = jwt.sign({ sub: user.username, user }, secret)
    const db = await getDrizzleDb()

    await db
        .insert(auth)
        .values({ username, jwt: token })
        .onConflictDoUpdate({
            target: auth.username,
            set: {
                jwt: token,
                createdOn: sql`CURRENT_TIMESTAMP`,
            },
        })

    return {
        username,
        jwt: token,
    }
}

export async function deauthenticate(
    username: string
): Promise<AuthRecord | null> {
    const db = await getDrizzleDb()
    const record = await db.query.auth.findFirst({
        where: eq(auth.username, username),
    })

    await db.delete(auth).where(eq(auth.username, username))

    return record ?? null
}
