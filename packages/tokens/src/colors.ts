export const colors = {
  bg: '#F2E6CE',
  text: '#1A1714',
  textMid: '#6A5A40',
  textLight: '#8A7A60',
  border: '#1A1714',
  borderSoft: '#D8C8A8',
  red: '#E8432A',
  yellow: '#FFD000',
  blue: '#2A5CA8',
  green: '#2A7A4A',
} as const;

export const darkColors = {
  bg: '#0C0A08',
  surface: '#141210',
  text: '#F2E6CE',
  textMid: '#7A7268',
  textLight: '#5A5650',
  borderSoft: '#1E1C18',
  borderHard: '#F2E6CE',
  red: '#E8432A',
  yellow: '#FFD000',
  blue: '#2A5CA8',
  green: '#2A7A4A',
} as const;

export type ColorToken = keyof typeof colors;
