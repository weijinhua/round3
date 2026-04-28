export const colors = {
  primary: 'hsl(221 83% 53%)',
  primaryForeground: 'hsl(0 0% 100%)',
  secondary: 'hsl(210 40% 96%)',
  secondaryForeground: 'hsl(222 47% 11%)',
  destructive: 'hsl(0 84% 60%)',
  destructiveForeground: 'hsl(0 0% 100%)',
  muted: 'hsl(210 40% 96%)',
  mutedForeground: 'hsl(215 16% 47%)',
  accent: 'hsl(210 40% 96%)',
  accentForeground: 'hsl(222 47% 11%)',
  background: 'hsl(0 0% 100%)',
  foreground: 'hsl(222 47% 11%)',
  card: 'hsl(0 0% 100%)',
  cardForeground: 'hsl(222 47% 11%)',
  border: 'hsl(214 32% 91%)',
  input: 'hsl(214 32% 91%)',
  ring: 'hsl(221 83% 53%)',
} as const;

export type ColorToken = keyof typeof colors;
