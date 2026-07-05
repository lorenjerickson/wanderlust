import { List } from "@/core/components/List/List";
import { Setting } from "@/core/types/settings";

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