import { useMemo, useState } from "react"
import { Outline } from "./components/Outline"
import { ConfigureContainer } from "./Configure.styles"
import {
  ModuleSettings,
  SettingValue,
  useConfiguration,
} from "./hooks/useConfiguration"
import { Section } from "./components/Section"
import { TextInput } from "@mantine/core"

export function Configure() {
  const { settings, settingsValues } = useConfiguration()
  const [selectedSettings, setSelectedSettings] =
    useState<ModuleSettings[]>(settings)
  const [searchTerms, setSearchTerms] = useState<string>("")

  const selectedSettingsValues = useMemo(() => {
    if (settingsValues === undefined) {
      return []
    }

    return selectedSettings.map((module) => ({
      moduleId: module.id,
      settings: module.settings.reduce(
        (acc, setting) => {
          const settingModule = settingsValues[module.id]
          if (settingModule) {
            const def = (acc[module.id] = acc[module.id] || {})
            const val = settingModule[setting.key]
            if (def && val) {
              def[setting.key] = val
            }
          }

          return acc
        },
        {} as Record<string, Record<string, SettingValue>>
      ),
    }))
  }, [settings])

  return (
    <ConfigureContainer>
      <div className="sub-header">
        <h2>Configure</h2>
      </div>
      <div className="search">
        <TextInput
          placeholder="Search"
          value={searchTerms}
          onChange={(event) => setSearchTerms(event.currentTarget.value)}
        />
      </div>
      <div className="container">
        <div className="nav">
          <Outline
            settings={settings}
            onSelected={(settings: ModuleSettings[]) =>
              setSelectedSettings(settings)
            }
          />
        </div>
        <div className="content">
          <Section
            sections={selectedSettings}
            values={selectedSettingsValues}
          />
        </div>
      </div>
    </ConfigureContainer>
  )
}
