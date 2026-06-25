import { TextStyle } from 'react-native';

import { colors } from './colors';

export const fonts = {
  display: 'SpaceGrotesk_700Bold',
  displayMedium: 'SpaceGrotesk_600SemiBold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
} as const;

export const typography = {
  /** 32px display — hero titles */
  hero: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.8,
    color: colors.text,
  } satisfies TextStyle,

  /** 26px — page titles */
  h1: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.5,
    color: colors.text,
  } satisfies TextStyle,

  /** 22px — section titles */
  h2: {
    fontFamily: fonts.displayMedium,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: colors.text,
  } satisfies TextStyle,

  /** 16px bold — card/subsection titles */
  h3: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  } satisfies TextStyle,

  /** 15px — primary body text */
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSecondary,
  } satisfies TextStyle,

  bodyMedium: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSecondary,
  } satisfies TextStyle,

  bodyBold: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    lineHeight: 23,
    color: colors.text,
  } satisfies TextStyle,

  /** 13px — captions, secondary info */
  bodySmall: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
  } satisfies TextStyle,

  /** 11px uppercase — labels, overlines */
  caption: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.0,
    textTransform: 'uppercase',
    color: colors.textMuted,
  } satisfies TextStyle,

  overline: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
  } satisfies TextStyle,

  /** Monospace-style large numbers */
  metric: {
    fontFamily: fonts.display,
    fontSize: 52,
    lineHeight: 58,
    letterSpacing: -1.5,
    color: colors.text,
  } satisfies TextStyle,

  tabLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    lineHeight: 14,
  } satisfies TextStyle,
} as const;
