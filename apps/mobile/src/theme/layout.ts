import { spacing } from './spacing';

// Floating pill tab bar (see app/(tabs)/_layout.tsx). HIG: tab target >=44pt; pill ~56pt tall.
export const TAB_BAR_HEIGHT = 56;
// Bottom padding so scroll content clears the pill + the home-indicator inset + a gap.
export const TAB_BAR_CLEARANCE = TAB_BAR_HEIGHT + spacing['3xl']; // 56 + 48 = 104
