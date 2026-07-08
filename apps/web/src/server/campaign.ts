'use server'

import { randomUUID } from 'crypto'

import { getDb } from '@/lib/db'

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

type CampaignRow = {
    id: string
    title: string
    description: string
    active: number
    world_id?: string | null
    short_description_rich_text?: string | null
    long_description_rich_text?: string | null
    map_image_url?: string | null
}

type UserPlayerCharacterRow = {
    id: string
    user_id: string
    name: string
    race?: string | null
    character_class?: string | null
}

type CampaignPlayerRow = {
    id: string
    campaign_id: string
    user_player_character_id: string
}

type CampaignLobbyPlayerRow = UserPlayerCharacterRow & {
    campaign_player_id: string
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
        worldId: row.world_id ?? undefined,
        shortDescriptionRichText:
            row.short_description_rich_text ?? row.description ?? '',
        longDescriptionRichText: row.long_description_rich_text ?? '',
        mapImageUrl: row.map_image_url ?? undefined,
    }
}

function mapUserPlayerCharacter(row: UserPlayerCharacterRow): UserPlayerCharacter {
    return {
        id: row.id,
        userId: row.user_id,
        name: row.name,
        race: row.race ?? undefined,
        characterClass: row.character_class ?? undefined,
    }
}

function mapCampaignPlayer(row: CampaignPlayerRow): CampaignPlayer {
    return {
        id: row.id,
        campaignId: row.campaign_id,
        userPlayerCharacterId: row.user_player_character_id,
    }
}

function mapCampaignLobbyPlayer(row: CampaignLobbyPlayerRow): CampaignLobbyPlayer {
    return {
        ...mapUserPlayerCharacter(row),
        campaignPlayerId: row.campaign_player_id,
        user: {
            id: row.user_id,
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
    const db = await getDb()
    const id = randomUUID()

    await db.run(
        `
            INSERT INTO campaigns (
                id,
                title,
                description,
                active,
                world_id,
                short_description_rich_text,
                long_description_rich_text,
                map_image_url
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        id,
        title,
        description,
        active ? 1 : 0,
        worldId ?? null,
        shortDescriptionRichText,
        longDescriptionRichText,
        mapImageUrl ?? null
    )

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
    const db = await getDb()
    const row = await db.get<CampaignRow>(
        `
            SELECT
                id,
                title,
                description,
                active,
                world_id,
                short_description_rich_text,
                long_description_rich_text,
                map_image_url
            FROM campaigns
            WHERE id = ?
        `,
        id
    )

    return row ? mapCampaign(row) : null
}

export async function findActiveCampaigns(): Promise<Campaign[]> {
    const db = await getDb()
    const rows = await db.all<CampaignRow[]>(
        `
            SELECT
                id,
                title,
                description,
                active,
                world_id,
                short_description_rich_text,
                long_description_rich_text,
                map_image_url
            FROM campaigns
            WHERE active = 1
            ORDER BY title ASC
        `
    )

    return rows.map(mapCampaign)
}

export async function findCampaignsByWorld(worldId: string): Promise<Campaign[]> {
    const db = await getDb()
    const rows = await db.all<CampaignRow[]>(
        `
            SELECT
                id,
                title,
                description,
                active,
                world_id,
                short_description_rich_text,
                long_description_rich_text,
                map_image_url
            FROM campaigns
            WHERE world_id = ?
            ORDER BY title ASC
        `,
        worldId
    )

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

    const db = await getDb()
    await db.run(
        `
            UPDATE campaigns
            SET title = ?,
                description = ?,
                active = ?,
                world_id = ?,
                short_description_rich_text = ?,
                long_description_rich_text = ?,
                map_image_url = ?
            WHERE id = ?
        `,
        nextCampaign.title,
        nextCampaign.description,
        nextCampaign.active ? 1 : 0,
        nextCampaign.worldId ?? null,
        nextCampaign.shortDescriptionRichText,
        nextCampaign.longDescriptionRichText,
        nextCampaign.mapImageUrl ?? null,
        id
    )

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

    const db = await getDb()
    await db.run('DELETE FROM campaigns WHERE id = ?', id)

    return current
}

export async function createUserPlayerCharacter({
    userId,
    name,
    race,
    characterClass,
}: CreateUserPlayerCharacterArgs): Promise<UserPlayerCharacter> {
    const db = await getDb()
    const id = randomUUID()

    await db.run(
        `
            INSERT INTO user_player_characters (
                id,
                user_id,
                name,
                race,
                character_class
            )
            VALUES (?, ?, ?, ?, ?)
        `,
        id,
        userId,
        name,
        race ?? null,
        characterClass ?? null
    )

    return {
        id,
        userId,
        name,
        race,
        characterClass,
    }
}

export async function findUserPlayerCharacters(userId: string): Promise<UserPlayerCharacter[]> {
    const db = await getDb()
    const rows = await db.all<UserPlayerCharacterRow[]>(
        `
            SELECT id, user_id, name, race, character_class
            FROM user_player_characters
            WHERE user_id = ?
        `,
        userId
    )

    return rows.map(mapUserPlayerCharacter)
}

export async function addPlayerCharacterToCampaign({
    campaignId,
    userPlayerCharacterId,
}: AddPlayerCharacterToCampaignArgs): Promise<CampaignPlayer> {
    const db = await getDb()
    const id = randomUUID()

    await db.run(
        `
            INSERT INTO campaign_players (
                id,
                user_player_character_id,
                campaign_id
            )
            VALUES (?, ?, ?)
        `,
        id,
        userPlayerCharacterId,
        campaignId
    )

    return {
        id,
        campaignId,
        userPlayerCharacterId,
    }
}

export async function findPlayerCharactersByCampaign(
    campaignId: string
): Promise<CampaignLobbyPlayer[]> {
    const db = await getDb()
    const rows = await db.all<CampaignLobbyPlayerRow[]>(
        `
            SELECT
                user_player_characters.id,
                user_player_characters.user_id,
                user_player_characters.name,
                user_player_characters.race,
                user_player_characters.character_class,
                campaign_players.id AS campaign_player_id,
                users.username,
                users.fullName,
                users.emailAddress,
                users.avatar
            FROM campaign_players
            INNER JOIN user_player_characters
                ON user_player_characters.id = campaign_players.user_player_character_id
            INNER JOIN users
                ON users.id = user_player_characters.user_id
            WHERE campaign_players.campaign_id = ?
            ORDER BY user_player_characters.name ASC
        `,
        campaignId
    )

    return rows.map(mapCampaignLobbyPlayer)
}

export async function removePlayerCharacterFromCampaign({
    campaignId,
    userPlayerCharacterId,
}: AddPlayerCharacterToCampaignArgs): Promise<CampaignPlayer | null> {
    const db = await getDb()
    const row = await db.get<CampaignPlayerRow>(
        `
            SELECT id, campaign_id, user_player_character_id
            FROM campaign_players
            WHERE campaign_id = ?
              AND user_player_character_id = ?
        `,
        campaignId,
        userPlayerCharacterId
    )

    if (!row) {
        return null
    }

    await db.run('DELETE FROM campaign_players WHERE id = ?', row.id)

    return mapCampaignPlayer(row)
}
