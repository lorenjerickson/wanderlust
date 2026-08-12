import { List } from '../List/List'
import type { Setting } from '../../types'

function toListItemProps(settings: Setting[]) {
  return settings.map((setting) => ({
    id: setting.key,
    title: setting.label,
    description: setting.description,
    href: `/settings/${setting.key}`,
  }));
}

export function SettingsList({ settings }: { settings: Setting[] }) {
  return <List items={toListItemProps(settings)} />
}
