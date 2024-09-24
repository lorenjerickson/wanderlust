import { Checkbox, List, NumberInput, Select, TextInput } from "@mantine/core"
import {
  SettingDefinition,
  ModuleSettings,
  useConfiguration,
  SettingValue,
} from "../hooks/useConfiguration"
import { SectionContainer } from "./Section.styles"

export function Section({
  sections,
  values,
}: {
  sections: Array<ModuleSettings>
  values: Record<string, Record<string, SettingValue>>
}) {
  const { updateSetting } = useConfiguration()

  const handleChange = async (
    module: ModuleSettings,
    setting: SettingDefinition,
    value: SettingValue
  ) => {
    updateSetting(module.id, setting.key, value)
  }

  const buildField = (module: ModuleSettings, setting: SettingDefinition) => {
    let value = setting.defaultValue
    switch (setting.type) {
      case "text":
        return (
          <TextInput
            label={setting.title}
            value={value as string}
            onChange={(event) =>
              handleChange(module, setting, event.currentTarget.value)
            }
          />
        )
      case "number":
        return (
          <NumberInput
            label={setting.title}
            value={value as number}
            onChange={(value) => handleChange(module, setting, value)}
          />
        )
      case "boolean":
        return (
          <Checkbox
            label={setting.title}
            checked={value as boolean}
            onChange={(event) => {
              handleChange(module, setting, event.currentTarget.checked)
            }}
          />
        )
      case "select":
        return (
          <Select
            label={setting.title}
            data={setting.possibleValues as string[]}
            value={value as string}
            onChange={(value) => handleChange(module, setting, value as string)}
          />
        )

      default:
        return <div>Unknown setting type</div>
    }
  }

  return (
    <SectionContainer>
      {sections.map((section) => (
        <div key={section.title}>
          <h3>{section.title}</h3>
          <List spacing="xs" size="sm" className="list">
            {section.settings.map((setting) => (
              <List.Item className="item" key={`${section.id}:${setting.id}`}>
                {buildField(section, setting)}
              </List.Item>
            ))}
          </List>
        </div>
      ))}
    </SectionContainer>
  )
}
