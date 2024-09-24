import { List } from "@mantine/core"
import { ModuleSettings } from "../hooks/useConfiguration"
import { OutlineContainer } from "./Outline.styles"

export const Outline = ({
  settings,
  onSelected,
}: {
  settings: Array<ModuleSettings>
  onSelected: (sections: ModuleSettings[]) => void
}) => {
  return (
    <OutlineContainer>
      <List spacing="xs" size="sm" className="list">
        {Object.values(settings).map((section: ModuleSettings) => (
          <List.Item
            className="item"
            key={`${section.id}`}
            onClick={() => onSelected([section])}
          >
            {section.title}
          </List.Item>
        ))}
      </List>
    </OutlineContainer>
  )
}
