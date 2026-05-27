export const provisionalGreenPalette = {
  mint: "#86e7b8",
  bright: "#93ff96",
  leaf: "#b2ffa8",
  pale: "#d0ffb7",
  cream: "#f2f5de",
} as const;

export const lightColors = {
  background: "#fbfff6",
  border: "#dce8d0",
  danger: "#d14343",
  onPrimary: "#092012",
  primary: provisionalGreenPalette.mint,
  primarySoft: provisionalGreenPalette.pale,
  success: "#24985a",
  surface: provisionalGreenPalette.cream,
  surfaceElevated: "#ffffff",
  text: "#102016",
  textMuted: "#62705f",
  warning: "#9a6b00",
} as const;

export const darkColors = {
  background: "#07130d",
  border: "#203327",
  danger: "#ff8b8b",
  onPrimary: "#092012",
  primary: provisionalGreenPalette.mint,
  primarySoft: "#1f3f2d",
  success: "#86e7b8",
  surface: "#0d1e14",
  surfaceElevated: "#13291d",
  text: "#ecf8ea",
  textMuted: "#9fb59f",
  warning: "#ffd166",
} as const;

export type ColorToken = keyof typeof lightColors;
