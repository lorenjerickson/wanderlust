'use server'

import { Setting, Settings, SettingsGroup, ValueType } from '@wanderlust/core'
import { eq } from 'drizzle-orm'

import { settingsGroups } from '@web/lib/db/schema'
import { getDrizzleDb } from '@web/lib/drizzle'
import { SettingsGroupRow } from './mappers'

function mapSettingsGroup(row: SettingsGroupRow): SettingsGroup {
    return {
        key: row.key,
        label: row.label,
        description: row.description,
        icon: row.icon ?? undefined,
        moduleId: row.moduleId ?? '',
        settings: JSON.parse(row.settings) as Setting[],
    }
}

export async function getAllSettings(): Promise<Settings> {
    const db = await getDrizzleDb()
    const rows = await db.select().from(settingsGroups)

    return rows.map(mapSettingsGroup)
}

export async function findSettingsByKey(
    groupKey: string
): Promise<SettingsGroup[]> {
    const db = await getDrizzleDb()
    const rows = await db
        .select()
        .from(settingsGroups)
        .where(eq(settingsGroups.key, groupKey))

    return rows.map(mapSettingsGroup)
}

export async function findSettingsByKeyAndSettingKey(
    groupKey: string,
    settingKey: string
): Promise<Setting | null> {
    const groups = await findSettingsByKey(groupKey)
    const group = groups[0]

    if (!group) {
        return null
    }

    return group.settings.find((setting) => setting.key === settingKey) ?? null
}

export async function updateAllGroupSettings(
    key: string,
    group: SettingsGroup
) {
    const db = await getDrizzleDb()
    const result = await db
        .update(settingsGroups)
        .set({
            label: group.label,
            description: group.description,
            icon: group.icon ?? null,
            moduleId: group.moduleId ?? null,
            settings: JSON.stringify(group.settings),
        })
        .where(eq(settingsGroups.key, key))

    return { changes: result.rowsAffected }
}

export async function updateOneGroupSetting(
    groupKey: string,
    settingKey: string,
    settingValue: ValueType
) {
    const group = (await findSettingsByKey(groupKey))[0]

    if (!group) {
        return { changes: 0 }
    }

    const nextSettings = group.settings.map((setting) => {
        if (setting.key !== settingKey) {
            return setting
        }

        return {
            ...setting,
            value: settingValue,
        }
    })

    const result = await updateAllGroupSettings(groupKey, {
        ...group,
        settings: nextSettings,
    })

    return result
}

export async function createSettings(settings: Settings) {
    const db = await getDrizzleDb()

    await db.transaction(async (tx) => {
        for (const group of settings) {
            await tx
                .insert(settingsGroups)
                .values({
                    key: group.key,
                    label: group.label,
                    description: group.description,
                    icon: group.icon ?? null,
                    moduleId: group.moduleId ?? null,
                    settings: JSON.stringify(group.settings),
                })
                .onConflictDoUpdate({
                    target: settingsGroups.key,
                    set: {
                        label: group.label,
                        description: group.description,
                        icon: group.icon ?? null,
                        moduleId: group.moduleId ?? null,
                        settings: JSON.stringify(group.settings),
                    },
                })
        }
    })

    return settings
}
