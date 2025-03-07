import { StyledSettings } from "./Configure.styles";
import { SettingFilter } from "./components/SettingFilter/SettingFilter";
import { SettingsDetail } from "./components/SettingDetail/SettingDetail";
import { SettingsList } from "./components/SettingsList/SettingsList";

export function Configure() {
  return (
    <StyledSettings>
      <div className="list">
        <SettingFilter />
        <div className="list-container">
          <SettingsList />
        </div>
      </div>
      <div className="detail">
        <SettingsDetail />
      </div>
    </StyledSettings>
  );
}
