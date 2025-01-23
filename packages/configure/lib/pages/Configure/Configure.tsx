import { Suspense, useEffect, useState } from "react";

import classes from "./Conifugre.module.scss";
import { useSettings } from "../../hooks/useSettings";
import { ISettingsGroup } from "@wanderlust/core";
import { SettingsGroups } from "../../components/SettingsGroups/SettingsGroups";
import { SettingsList } from "../../components/SettingsList/SettingsList";

export function Configure() {
  const { settings, isLoading, addSettings } = useSettings();

  useEffect(() => {
    if (!isLoading && settings) {
      const siteSettings = settings.find((setting: ISettingsGroup) => setting.key === siteManifest.key);
      if (!siteSettings) {
        addSettings(siteManifest.settings);
      }
    }
  }, [settings, isLoading, siteManifest]);

  const [selectedSettings, setSelectedSettings] =
    useState<ISettingsGroup[]>(settings);
  const handleSettingSelected = (settings: ISettingsGroup) => {
    setSelectedSettings([settings]);
  };
  return (
    <Suspense fallback={"Loading..."}>
      <div className={classes.configure}>
        {isLoading && <div>Loading...</div>}
        {!isLoading && !settings && <div>No settings found</div>}
        {!isLoading && settings && (
          <>
            <div className={classes.groups}>
              <SettingsGroups groups={settings} />
            </div>
            <div className={classes.list}>
              <SettingsList settings={settings} />
            </div>
          </>
        )}
      </div>
    </Suspense>
  );
}
