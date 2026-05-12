export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 36,
  '3xl': 48,
  '4xl': 64,
} as const;

export type SpacingKey = keyof typeof spacing;
