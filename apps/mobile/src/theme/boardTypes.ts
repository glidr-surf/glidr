import { colors } from './colors';

export const BOARD_TYPES = ['FISH', 'LOG', 'MID', 'SHORT', 'ALT', 'GUN'] as const;

export const boardTypeColors: Record<string, string> = {
  FISH: colors.red,
  SHORT: colors.red,
  LOG: colors.yellow,
  MID: colors.blue,
  ALT: '#7A4A8A',
  GUN: '#D4762C',
};
