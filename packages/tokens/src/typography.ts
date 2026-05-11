export const fontFamilies = {
  display: 'Bebas Neue',
  body: 'DM Sans',
  mono: 'DM Mono',
} as const;

export const typeRoles = {
  displayXl: { font: 'display' as const, intent: 'hero-heading' },
  displayL: { font: 'display' as const, intent: 'section-heading' },
  displayM: { font: 'display' as const, intent: 'stat-number' },
  displayS: { font: 'display' as const, intent: 'board-name-list' },
  rating: { font: 'display' as const, intent: 'board-rating' },
  bodyL: { font: 'body' as const, intent: 'primary-description' },
  bodyM: { font: 'body' as const, intent: 'review-text' },
  bodyS: { font: 'body' as const, intent: 'secondary-info' },
  bodyXs: { font: 'body' as const, intent: 'small-metadata' },
  label: { font: 'mono' as const, intent: 'section-label' },
  tag: { font: 'mono' as const, intent: 'type-badge' },
  micro: { font: 'mono' as const, intent: 'smallest-label' },
} as const;

export type TypeRole = keyof typeof typeRoles;
export type FontFamily = keyof typeof fontFamilies;
