import { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";

import { darkColors, lightColors } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";

type Theme = {
  colors: Record<keyof typeof lightColors, string>;
  colorScheme: "light" | "dark";
  spacing: typeof spacing;
  typography: typeof typography;
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const colorScheme: Theme["colorScheme"] = systemScheme === "dark" ? "dark" : "light";

  const theme = useMemo(
    () => ({
      colors: colorScheme === "dark" ? darkColors : lightColors,
      colorScheme,
      spacing,
      typography,
    }),
    [colorScheme],
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return theme;
}
