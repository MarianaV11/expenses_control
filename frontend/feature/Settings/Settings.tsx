import React from "react";
import SettingsProfile from "./components/SettingsProfile";
import SettingsAppearance from "./components/SettingsAppearance";
import SettingsDangerZone from "./components/SettingsDangerZone";
import SettingsSecurity from "./components/SettingsSecurity";

const Settings = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <SettingsProfile />
      <SettingsAppearance />
      <SettingsSecurity />
      <SettingsDangerZone />
    </div>
  );
};

export default Settings;
