import { Button, Icon } from "@repo/ui/mobile";
import { MoonStarIcon, SunIcon } from "lucide-react-native";
import { Uniwind, useUniwind } from "uniwind";

export function ThemeSwitch() {
  const { theme } = useUniwind();

  const THEME_ICONS = {
    light: SunIcon,
    dark: MoonStarIcon,
  };

  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    Uniwind.setTheme(newTheme);
  }

  return (
    <Button
      onPress={toggleTheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 web:mx-4 rounded-full"
    >
      <Icon as={THEME_ICONS[theme ?? "light"]} className="size-5 text-foreground" />
    </Button>
  );
}
