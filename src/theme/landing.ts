import { colors } from './colors';

/** Marketing-site aliases — kept in sync with the app light theme. */
export const landing = {
  bg: colors.background,
  bgAlt: colors.backgroundElevated,
  bgMuted: colors.surfaceHover,
  surface: colors.surface,
  border: colors.border,
  borderStrong: colors.borderStrong,
  text: colors.text,
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,
  primary: colors.primary,
  primaryHover: '#0052CC',
  primarySoft: colors.primarySoft,
  accent: colors.accent,
  accentSoft: colors.accentSoft,
  success: colors.success,
  shadow: colors.shadow,
  shadowLg: colors.shadowLg,
} as const;
