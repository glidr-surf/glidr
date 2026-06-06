import { TextStyle } from 'react-native';
import { colors } from './colors';

export const fonts = {
  display: 'BebasNeue_400Regular',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemiBold: 'DMSans_600SemiBold',
  bodyBold: 'DMSans_700Bold',
} as const;

export const typeStyles: Record<string, TextStyle> = {
  displayXl: { fontFamily: fonts.display, fontSize: 48, color: colors.text, letterSpacing: 2 },
  displayL: { fontFamily: fonts.display, fontSize: 32, color: colors.text, letterSpacing: 2 },
  displayM: { fontFamily: fonts.display, fontSize: 24, color: colors.text, letterSpacing: 1 },
  displayS: { fontFamily: fonts.display, fontSize: 20, color: colors.text, letterSpacing: 1 },
  bodyL: { fontFamily: fonts.body, fontSize: 17, color: colors.text, lineHeight: 26 },
  bodyM: { fontFamily: fonts.body, fontSize: 15, color: colors.text, lineHeight: 22 },
  label: { fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.textMid, letterSpacing: 1.4, textTransform: 'uppercase' },
  caption: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.textLight, letterSpacing: 1, textTransform: 'uppercase' },
} as const;

export type TypeVariant = keyof typeof typeStyles;
