import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const SettingsAppearance = () => {
  const { theme, setTheme } = useTheme();

  const onSwitch = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <div className="flex flex-col gap-4 border rounded-md p-8 bg-background w-[55%] max-lg:w-[100%]">
      <h1 className="text-3xl">Appearance</h1>
      <p className="text-muted-foreground text-sm">
        Customize how the app looks
      </p>
      <div className="flex items-center gap-3">
        {theme === "light" ? (
          <Sun className="text-primary max-sm:hidden" />
        ) : (
          <Moon className="text-primary max-sm:hidden" />
        )}
        <div>
          <h2 className="text-md">Dark Mode</h2>
          <p className="text-muted-foreground text-sm">
            Switch between light and dark themes
          </p>
        </div>
        <Switch
          checked={theme == "dark"}
          className="ml-auto"
          onClick={onSwitch}
        />
      </div>
    </div>
  );
};

export default SettingsAppearance;
