'use server'

import { randomUUID } from 'crypto'
import { and, asc, eq } from 'drizzle-orm'

import {
    campaignPlayers,
    campaigns,
    userPlayerCharacters,
    users,
} from '@/lib/db/schema'
import { getDrizzleDb } from '@/lib/drizzle'

export type Campaign = {
    id: string
    title: string
    description: string
    active: boolean
    worldId?: string
    shortDescriptionRichText: string
    longDescriptionRichText: string
    mapImageUrl?: string
}

export type UserPlayerCharacter = {
    id: string
    userId: string
    name: string
    race?: string
    characterClass?: string
}

export type CampaignPlayer = {
    id: string
    campaignId: string
    userPlayerCharacterId: string
}

export type CampaignLobbyPlayer = UserPlayerCharacter & {
    campaignPlayerId: string
    user: {
        id: string
        username: string
        fullName: string
        emailAddress: string
        avatar?: string
    }
}

type CampaignRow = typeof campaigns.$inferSelect
type UserPlayerCharacterRow = typeof userPlayerCharacters.$inferSelect
type CampaignPlayerRow = typeof campaignPlayers.$inferSelect

type CampaignLobbyPlayerRow = UserPlayerCharacterRow & {
    campaignPlayerId: string
    username: string
    fullName: string
    emailAddress: string
    avatar?: string | null
}

type CreateCampaignArgs = {
    title: string
    description?: string
    active?: boolean
    worldId?: string
    shortDescriptionRichText?: string
    longDescriptionRichText?: string
    mapImageUrl?: string
}

type UpdateCampaignArgs = Partial<CreateCampaignArgs> & {
    id: string
}

type CreateUserPlayerCharacterArgs = {
    userId: string
    name: string
    race?: string
    characterClass?: string
}

type AddPlayerCharacterToCampaignArgs = {
    campaignId: string
    userPlayerCharacterId: string
}

function mapCampaign(row: CampaignRow): Campaign {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        active: Boolean(row.active),
        worldId: row.worldId ?? undefined,
        shortDescriptionRichText:
            row.shortDescriptionRichText ?? row.description ?? '',
        longDescriptionRichText: row.longDescriptionRichText ?? '',
        mapImageUrl: row.mapImageUrl ?? undefined,
    }
}

function mapUserPlayerCharacter(
    row: UserPlayerCharacterRow
): UserPlayerCharacter {
    return {
        id: row.id,
        userId: row.userId,
        name: row.name,
        race: row.race ?? undefined,
        characterClass: row.characterClass ?? undefined,
    }
}

function mapCampaignPlayer(row: CampaignPlayerRow): CampaignPlayer {
    return {
        id: row.id,
        campaignId: row.campaignId,
        userPlayerCharacterId: row.userPlayerCharacterId,
    }
}

function mapCampaignLobbyPlayer(
    row: CampaignLobbyPlayerRow
): CampaignLobbyPlayer {
    return {
        ...mapUserPlayerCharacter(row),
        campaignPlayerId: row.campaignPlayerId,
        user: {
            id: row.userId,
            username: row.username,
            fullName: row.fullName,
            emailAddress: row.emailAddress,
            avatar: row.avatar ?? undefined,
        },
    }
}

export async function createCampaign({
    title,
    description = '',
    active = true,
    worldId,
    shortDescriptionRichText = description,
    longDescriptionRichText = '',
    mapImageUrl,
}: CreateCampaignArgs): Promise<Campaign> {
    const db = await getDrizzleDb()
    const id = randomUUID()

    await db.insert(campaigns).values({
        id,
        title,
        description,
        active: active ? 1 : 0,
        worldId: worldId ?? null,
        shortDescriptionRichText,
        longDescriptionRichText,
        mapImageUrl: mapImageUrl ?? null,
    })

    return {
        id,
        title,
        description,
        active,
        worldId,
        shortDescriptionRichText,
        longDescriptionRichText,
        mapImageUrl,
    }
}

export async function findCampaignById(id: string): Promise<Campaign | null> {
    const db = await getDrizzleDb()
    const row = await db.query.campaigns.findFirst({
        where: eq(campaigns.id, id),
    })

    return row ? mapCampaign(row) : null
}

export async function findActiveCampaigns(): Promise<Campaign[]> {
    const db = await getDrizzleDb()
    const rows = await db
        .select()
        .from(campaigns)
        .where(eq(campaigns.active, 1))
        .orderBy(asc(campaigns.title))

    return rows.map(mapCampaign)
}

export async function findCampaignsByWorld(
    worldId: string
): Promise<Campaign[]> {
    const db = await getDrizzleDb()
    const rows = await db
        .select()
        .from(campaigns)
        .where(eq(campaigns.worldId, worldId))
        .orderBy(asc(campaigns.title))

    return rows.map(mapCampaign)
}

export async function updateCampaign({
    id,
    title,
    description,
    active,
    worldId,
    shortDescriptionRichText,
    longDescriptionRichText,
    mapImageUrl,
}: UpdateCampaignArgs): Promise<Campaign | null> {
    const current = await findCampaignById(id)

    if (!current) {
        return null
    }

    const nextCampaign = {
        title: title ?? current.title,
        description: description ?? current.description,
        active: active ?? current.active,
        worldId: worldId ?? current.worldId,
        shortDescriptionRichText:
            shortDescriptionRichText ?? current.shortDescriptionRichText,
        longDescriptionRichText:
            longDescriptionRichText ?? current.longDescriptionRichText,
        mapImageUrl: mapImageUrl ?? current.mapImageUrl,
    }

    const db = await getDrizzleDb()
    await db
        .update(campaigns)
        .set({
            title: nextCampaign.title,
            description: nextCampaign.description,
            active: nextCampaign.active ? 1 : 0,
            worldId: nextCampaign.worldId ?? null,
            shortDescriptionRichText: nextCampaign.shortDescriptionRichText,
            longDescriptionRichText: nextCampaign.longDescriptionRichText,
            mapImageUrl: nextCampaign.mapImageUrl ?? null,
        })
        .where(eq(campaigns.id, id))

    return {
        id,
        ...nextCampaign,
    }
}

export async function deleteCampaign(id: string): Promise<Campaign | null> {
    const current = await findCampaignById(id)

    if (!current) {
        return null
    }

    const db = await getDrizzleDb()
    await db.delete(campaigns).where(eq(campaigns.id, id))

    return current
}

export async function createUserPlayerCharacter({
    userId,
    name,
    race,
    characterClass,
}: CreateUserPlayerCharacterArgs): Promise<UserPlayerCharacter> {
    const db = await getDrizzleDb()
    const id = randomUUID()

    await db.insert(userPlayerCharacters).values({
        id,
        userId,
        name,
        race: race ?? null,
        characterClass: characterClass ?? null,
    })

    return {
        id,
        userId,
        name,
        race,
        characterClass,
    }
}

export async function findUserPlayerCharacters(
    userId: string
): Promise<UserPlayerCharacter[]> {
    const db = await getDrizzleDb()
    const rows = await db
        .select()
        .from(userPlayerCharacters)
        .where(eq(userPlayerCharacters.userId, userId))

    return rows.map(mapUserPlayerCharacter)
}

export async function addPlayerCharacterToCampaign({
    campaignId,
    userPlayerCharacterId,
}: AddPlayerCharacterToCampaignArgs): Promise<CampaignPlayer> {
    const db = await getDrizzleDb()
    const id = randomUUID()

    await db.insert(campaignPlayers).values({
        id,
        userPlayerCharacterId,
        campaignId,
    })

    return {
        id,
        campaignId,
        userPlayerCharacterId,
    }
}

export async function findPlayerCharactersByCampaign(
    campaignId: string
): Promise<CampaignLobbyPlayer[]> {
    const db = await getDrizzleDb()
    const rows = await db
        .select({
            id: userPlayerCharacters.id,
            userId: userPlayerCharacters.userId,
            name: userPlayerCharacters.name,
            race: userPlayerCharacters.race,
            characterClass: userPlayerCharacters.characterClass,
            campaignPlayerId: campaignPlayers.id,
            username: users.username,
            fullName: users.fullName,
            emailAddress: users.emailAddress,
            avatar: users.avatar,
        })
        .from(campaignPlayers)
        .innerJoin(
            userPlayerCharacters,
            eq(userPlayerCharacters.id, campaignPlayers.userPlayerCharacterId)
        )
        .innerJoin(users, eq(users.id, userPlayerCharacters.userId))
        .where(eq(campaignPlayers.campaignId, campaignId))
        .orderBy(asc(userPlayerCharacters.name))

    return rows.map(mapCampaignLobbyPlayer)
}

export async function removePlayerCharacterFromCampaign({
    campaignId,
    userPlayerCharacterId,
}: AddPlayerCharacterToCampaignArgs): Promise<CampaignPlayer | null> {
    const db = await getDrizzleDb()
    const row = await db.query.campaignPlayers.findFirst({
        where: and(
            eq(campaignPlayers.campaignId, campaignId),
            eq(campaignPlayers.userPlayerCharacterId, userPlayerCharacterId)
        ),
    })

    if (!row) {
        return null
    }

    await db.delete(campaignPlayers).where(eq(campaignPlayers.id, row.id))

    return mapCampaignPlayer(row)
}
