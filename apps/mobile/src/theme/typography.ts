import { TextStyle } from 'react-native';
import { colors } from './colors';

export const fonts = {
  display: 'BebasNeue_400Regular',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemiBold: 'DMSans_600SemiBold',
  bodyBold: 'DMSans_700Bold',
  mono: 'DMMono_400Regular',
  monoMedium: 'DMMono_500Medium',
} as const;

export const typeStyles: Record<string, TextStyle> = {
  displayXl: { fontFamily: fonts.display, fontSize: 48, color: colors.text, letterSpacing: 2 },
  displayL: { fontFamily: fonts.display, fontSize: 32, color: colors.text, letterSpacing: 2 },
  displayM: { fontFamily: fonts.display, fontSize: 24, color: colors.text, letterSpacing: 1 },
  displayS: { fontFamily: fonts.display, fontSize: 18, color: colors.text, letterSpacing: 1 },
  bodyL: { fontFamily: fonts.body, fontSize: 16, color: colors.text, lineHeight: 24 },
  bodyM: { fontFamily: fonts.body, fontSize: 14, color: colors.text, lineHeight: 20 },
  bodyS: { fontFamily: fonts.body, fontSize: 12, color: colors.textMid, lineHeight: 18 },
  bodyXs: { fontFamily: fonts.body, fontSize: 10, color: colors.textMid, lineHeight: 14 },
  label: { fontFamily: fonts.mono, fontSize: 10, color: colors.textLight, letterSpacing: 1.2, textTransform: 'uppercase' },
  tag: { fontFamily: fonts.mono, fontSize: 8, color: colors.white, letterSpacing: 0.8, textTransform: 'uppercase' },
  micro: { fontFamily: fonts.mono, fontSize: 7, color: colors.textLight, letterSpacing: 0.6, textTransform: 'uppercase' },
} as const;

export type TypeVariant = keyof typeof typeStyles;
