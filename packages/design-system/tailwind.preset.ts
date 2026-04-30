import { colors, spacing, typography, radius, shadow } from './tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tailwindPreset: Record<string, any> = {
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      primary: {
        DEFAULT: colors.primary,
        foreground: colors.primaryForeground,
      },
      secondary: {
        DEFAULT: colors.secondary,
        foreground: colors.secondaryForeground,
      },
      destructive: {
        DEFAULT: colors.destructive,
        foreground: colors.destructiveForeground,
      },
      muted: {
        DEFAULT: colors.muted,
        foreground: colors.mutedForeground,
      },
      accent: {
        DEFAULT: colors.accent,
        foreground: colors.accentForeground,
      },
      background: colors.background,
      foreground: colors.foreground,
      card: {
        DEFAULT: colors.card,
        foreground: colors.cardForeground,
      },
      border: colors.border,
      input: colors.input,
      ring: colors.ring,
    },
    extend: {
      spacing,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      borderRadius: radius,
      boxShadow: shadow,
    },
  },
};
