# Latest Opinions Section Redesign

## Problem

The Latest Opinions section on the home screen uses `CompactOpinionCard` — bordered list rows with a light/transparent background. Every other section on the home screen (Trending, Shapers, All Boards grid) uses dark filled cards (`cardDark` #2A2720). The visual mismatch breaks the page's cohesion.

## Solution

Replace the vertical list of `CompactOpinionCard` components with a horizontal `ScrollView` of dark opinion cards, matching the Trending section's pattern.

## Card Spec

- **Container:** 160px wide, 150px tall, `cardDark` background, padding `spacing.md` (12)
- **Layout (top to bottom, justified with flex):**
  - **Top row:** `BoardTypeTag` (size="sm") left-aligned, timestamp (micro, white) right-aligned
  - **Board name:** displayS, white, numberOfLines=1
  - **Rating:** `SurfboardRating` size=8, white
  - **Username:** micro, white — "by {username}"
  - **Snippet:** bodyXs, textMid, numberOfLines=1 — opinion text (omit if no text)
- **Interaction:** `Pressable`, navigates to `/board/{boardId}`

## Section Layout

- Section label: "LATEST OPINIONS" (same `label` variant + `sectionLabel` style as Trending/Shapers)
- Horizontal `ScrollView` with `showsHorizontalScrollIndicator={false}`
- `contentContainerStyle`: `paddingHorizontal: spacing.xl` (24), `gap: spacing.md` (12)
- Same pattern as the Trending scroll section

## Scope

- Modify: `apps/mobile/app/(tabs)/index.tsx` — replace the `gridFooter` content
- The `CompactOpinionCard` component is NOT deleted (used elsewhere or may be reused)
- No new component file — the opinion card markup is simple enough to inline in the footer, consistent with how Trending cards are inlined in the header
- Data source unchanged: 6 latest opinions sorted by `createdAt` descending
