/** Mirrors apps/mobile/src/theme/colors.ts */
export const greenPalette = {
  mint: '#86e7b8',
  bright: '#93ff96',
  leaf: '#b2ffa8',
  pale: '#d0ffb7',
  cream: '#f2f5de',
} as const

export const light = {
  background: '#fbfff6',
  border: '#dce8d0',
  onPrimary: '#092012',
  primary: greenPalette.mint,
  primarySoft: greenPalette.pale,
  surface: greenPalette.cream,
  surfaceElevated: '#ffffff',
  text: '#102016',
  textMuted: '#62705f',
} as const

export const dark = {
  background: '#07130d',
  border: '#203327',
  onPrimary: '#092012',
  primary: greenPalette.mint,
  primarySoft: '#1f3f2d',
  surface: '#0d1e14',
  surfaceElevated: '#13291d',
  text: '#ecf8ea',
  textMuted: '#9fb59f',
} as const