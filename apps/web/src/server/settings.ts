'use server'

import { Setting, Settings, SettingsGroup, ValueType } from '@wanderlust/core'

import { getDb } from '@web/lib/db'
import { SettingsGroupRow } from './sqlite'

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
    const db = await getDb()
    const rows = await db.all<SettingsGroupRow[]>('SELECT * FROM settings_groups')

    return rows.map(mapSettingsGroup)
}

export async function findSettingsByKey(groupKey: string): Promise<SettingsGroup[]> {
    const db = await getDb()
    const rows = await db.all<SettingsGroupRow[]>(
        'SELECT * FROM settings_groups WHERE key = ?',
        groupKey
    )

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

export async function updateAllGroupSettings(key: string, group: SettingsGroup) {
    const db = await getDb()
    const result = await db.run(
        `
            UPDATE settings_groups
            SET label = ?,
                description = ?,
                icon = ?,
                moduleId = ?,
                settings = ?
            WHERE key = ?
        `,
        group.label,
        group.description,
        group.icon ?? null,
        group.moduleId ?? null,
        JSON.stringify(group.settings),
        key
    )

    return result
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
    const db = await getDb()

    for (const group of settings) {
        await db.run(
            `
                INSERT INTO settings_groups (
                    key,
                    label,
                    description,
                    icon,
                    moduleId,
                    settings
                )
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(key) DO UPDATE SET
                    label = excluded.label,
                    description = excluded.description,
                    icon = excluded.icon,
                    moduleId = excluded.moduleId,
                    settings = excluded.settings
            `,
            group.key,
            group.label,
            group.description,
            group.icon ?? null,
            group.moduleId ?? null,
            JSON.stringify(group.settings)
        )
    }

    return settings
}
