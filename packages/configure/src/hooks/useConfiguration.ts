import { useEffect, useMemo, useState } from "react"

import defaultSettings from "../data/settings.json"

export type SettingValue = string | number | boolean | undefined
export type SettingType = "text" | "number" | "boolean" | "select"

export type SettingDefinition = {
  id: string
  title: string
  description: string
  key: string
  type: SettingType
  defaultValue: SettingValue
  possibleValues?: Array<string | number>
}

export type ModuleSettings = {
  id: string
  title: string
  settings: Array<SettingDefinition>
}

export function useConfiguration() {
  const [settings, setSettings] = useState<Array<ModuleSettings>>([])
  const [settingsValues, setSettingsValues] = useState<
    Record<string, Record<string, SettingValue>> | undefined
  >(undefined)

  useEffect(() => {
    if (settings.length === 0) {
      setSettings(defaultSettings as Array<ModuleSettings>)
    } else if (settingsValues === undefined) {
      const values = {} as Record<string, Record<string, SettingValue>>
      settings.forEach((section) => {
        values[section.id] = section.settings.reduce(
          (acc, setting) => {
            acc[setting.key] = setting.defaultValue
            return acc
          },
          {} as Record<string, SettingValue>
        )
      })
      setSettingsValues(values)
    }
  }, [settings])

  useEffect(() => {
    saveSettings()
  }, [settings])

  const saveSettings = async () => {}

  const settingsSorter = (a: ModuleSettings, b: ModuleSettings) => {
    if (a.title < b.title) {
      return -1
    } else if (a.title > b.title) {
      return 1
    } else {
      return 0
    }
  }

  return useMemo(() => {
    const addSettings = async (section: ModuleSettings) => {
      const index = settings.findIndex((item) => item.title === section.title)
      if (index < 0) {
        setSettings((current) => [...current, section].sort(settingsSorter))
      }
    }

    const removeSettings = async (moduleId: string) => {
      const updated = [...settings]
      const index = updated.findIndex((item) => item.title === moduleId)
      if (index >= 0) {
        updated.splice(index, 1)
        setSettings(updated)
      }
    }

    const updateSetting = async (
      moduleId: string,
      key: string,
      setting: SettingValue
    ) => {
      const updated = { ...settingsValues }
      const module = updated[moduleId]
      if (module) {
        module[key] = setting
        setSettingsValues(updated)
      }
    }

    return {
      settings,
      settingsValues,
      addSettings,
      removeSettings,
      updateSetting,
    }
  }, [settings])
}
