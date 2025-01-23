import { useSettings } from "@/hooks/useSettings";

import { StyledSettings } from "./Settings.styles";
import { SettingsFilter } from "@/components/SettingsFilter";
import { SettingsList } from "@/components/SettingsList";
import { SettingsDetails } from "@/components/SettingsDetails";


export function Settings() {
  const { settings, settingsFilter, setSettingsFilter } = useSettings();

  return (
    <StyledSettings>
      <div className="list">
        <SettingsFilter
          filter={settingsFilter}
          onFilterChanged={setSettingsFilter}
        />
        <div className="list-container">
          <SettingsList settings={settings} filter={settingsFilter} />
        </div>
      </div>
      <div className="detail">
        <SettingsDetails settings={settings} />
      </div>
    </StyledSettings>
  );
}
