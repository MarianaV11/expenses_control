import React from "react";
import SettingsProfile from "./components/SettingsProfile";
import SettingsAppearance from "./components/SettingsAppearance";
import SettingsDangerZone from "./components/SettingsDangerZone";
import SettingsSecurity from "./components/SettingsSecurity";

const Settings = () => {
  return (
    <div className="mt-4">
      <h1 className="text-3xl ml-4 mb-4">Settings</h1>
      <div className="flex flex-col items-center gap-4">
        <SettingsProfile />
        <SettingsAppearance />
        <SettingsSecurity />
        <SettingsDangerZone />
      </div>
    </div>
  );
};

export default Settings;
