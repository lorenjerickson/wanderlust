'use server'

import { and, asc, count, eq, isNull } from 'drizzle-orm'

import {
    campaignGms,
    campaignPlayers,
    campaigns,
    worlds,
} from '@/lib/db/schema'
import { auth0 } from '@/lib/auth0'
import { getDrizzleDb } from '@/lib/drizzle'
import { createCampaign } from '@/server/campaign'
import { findOneUserByExternalAuthSubject } from '@/server/user'
import { createWorld } from '@/server/world'

export type OwnedWorldSummary = {
    id: string
    name: string
    description: string
    campaignCount: number
}

export type OwnedCampaignSummary = {
    id: string
    worldId?: string
    title: string
    worldName: string
    active: boolean
    playerCount: number
    description: string
}

async function requireAuthenticatedGm() {
    const session = await auth0.getSession()
    const externalAuthSubject = session?.user?.sub

    if (!externalAuthSubject) {
        throw new Error('You must be signed in to create content.')
    }

    const user = await findOneUserByExternalAuthSubject(externalAuthSubject)

    if (!user?.isGm) {
        throw new Error('Only game masters can create worlds and campaigns.')
    }

    return user
}

export async function findWorldsOwnedByUser(
    userId: string
): Promise<OwnedWorldSummary[]> {
    const db = await getDrizzleDb()
    const rows = await db
        .select({
            id: worlds.id,
            name: worlds.name,
            description: worlds.description,
            campaignCount: count(campaigns.id),
        })
        .from(worlds)
        .leftJoin(campaigns, eq(campaigns.worldId, worlds.id))
        .where(eq(worlds.ownerUserId, userId))
        .groupBy(worlds.id, worlds.name, worlds.description)
        .orderBy(asc(worlds.name))

    return rows
}

export async function findCampaignsOwnedByUser(
    userId: string
): Promise<OwnedCampaignSummary[]> {
    const db = await getDrizzleDb()
    const rows = await db
        .select({
            id: campaigns.id,
            worldId: worlds.id,
            title: campaigns.title,
            worldName: worlds.name,
            active: campaigns.active,
            playerCount: count(campaignPlayers.id),
            description: campaigns.description,
        })
        .from(campaignGms)
        .innerJoin(campaigns, eq(campaigns.id, campaignGms.campaignId))
        .leftJoin(worlds, eq(worlds.id, campaigns.worldId))
        .leftJoin(campaignPlayers, eq(campaignPlayers.campaignId, campaigns.id))
        .where(
            and(eq(campaignGms.userId, userId), isNull(campaignGms.deletedAt))
        )
        .groupBy(
            campaigns.id,
            worlds.id,
            campaigns.title,
            worlds.name,
            campaigns.active,
            campaigns.description
        )
        .orderBy(asc(campaigns.title))

    return rows.map((row) => ({
        ...row,
        worldId: row.worldId ?? undefined,
        worldName: row.worldName ?? 'No world assigned',
        active: Boolean(row.active),
    }))
}

export async function createOwnedWorld({
    name,
    description = '',
}: {
    name: string
    description?: string
}): Promise<OwnedWorldSummary> {
    const user = await requireAuthenticatedGm()
    const world = await createWorld({
        ownerUserId: user._id,
        name,
        description,
    })

    return { ...world, campaignCount: 0 }
}

export async function createOwnedCampaign({
    worldId,
    title,
    description = '',
}: {
    worldId: string
    title: string
    description?: string
}): Promise<OwnedCampaignSummary> {
    const user = await requireAuthenticatedGm()
    const db = await getDrizzleDb()
    const ownedWorld = await db.query.worlds.findFirst({
        where: and(eq(worlds.id, worldId), eq(worlds.ownerUserId, user._id)),
    })

    if (!ownedWorld) {
        throw new Error('Choose a world you own.')
    }

    const campaign = await createCampaign({
        gmUserId: user._id,
        worldId,
        title,
        description,
    })

    return {
        id: campaign.id,
        worldId,
        title: campaign.title,
        worldName: ownedWorld.name,
        active: campaign.active,
        playerCount: 0,
        description: campaign.description,
    }
}
