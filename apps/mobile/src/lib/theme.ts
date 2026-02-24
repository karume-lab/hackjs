import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";
import { useCSSVariable, useUniwind } from "uniwind";

export function useNavTheme(): Theme {
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  const background = useCSSVariable("--color-background");
  const foreground = useCSSVariable("--color-foreground");
  const card = useCSSVariable("--color-card");
  const border = useCSSVariable("--color-border");
  const primary = useCSSVariable("--color-primary");
  const destructive = useCSSVariable("--color-destructive");

  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  return {
    ...baseTheme,
    colors: {
      background: background as string,
      border: border as string,
      card: card as string,
      notification: destructive as string,
      primary: primary as string,
      text: foreground as string,
    },
  };
}
