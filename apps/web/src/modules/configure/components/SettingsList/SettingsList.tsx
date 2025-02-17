import { ISettingsGroup, ISetting, ValueType } from "@wanderlust/core";
import { SettingEditor } from "../SettingsEditor/SettingsEditor";
import { StyledSettingsList } from "./SettingsList.styles";

export function SettingsList({ settings }: { settings: ISettingsGroup[] }) {
  const handleSettingChanged = (
    settingKey: string,
    settingValue: ValueType
  ) => {
    console.log("Setting changed", settingKey, settingValue);
  };
  return (
    <StyledSettingsList>
      {settings &&
        settings.map((group: ISettingsGroup) => (
          <div key={group.label} className="group">
            <h3>{group.label}</h3>
            <p>{group.description}</p>
            {group.settings.map((setting: ISetting) => (
              <div className="setting">
                <SettingEditor
                  key={setting.key}
                  setting={setting}
                  onChange={handleSettingChanged}
                />
              </div>
            ))}
          </div>
        ))}
    </StyledSettingsList>
  );
}
