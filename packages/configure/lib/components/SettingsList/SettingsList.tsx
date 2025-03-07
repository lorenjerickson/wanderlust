import { useSettings } from "@configure/hooks/useSettings";
import { List } from "@wanderlust/ui";

export function SettingsList() {
  const { settings } = useSettings();
  return <List items={settings} />
}