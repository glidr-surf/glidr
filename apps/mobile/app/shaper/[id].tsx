import { useState, useEffect, useMemo, useCallback } from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CaretLeft, ShareNetwork } from 'phosphor-react-native';
import { Screen } from '../../src/components/Screen';
import { GText } from '../../src/components/GText';
import { StatBlock } from '../../src/components/StatBlock';
import { BoardTile } from '../../src/components/BoardTile';
import { Chips } from '../../src/components/Chips';
import { Skeleton } from '../../src/components/Skeleton';
import { navBack } from '../../src/utils/navBack';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { getShaper, getBoards } from '@glidr/data';
import type { Shaper, Board } from '@glidr/data';
import { supabase } from '../../src/lib/supabase';

const SORT_OPTIONS = ['HIGHEST RATED', 'MOST OPINIONED', 'NEWEST'];
const tapHaptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

export default function ShaperScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sort, setSort] = useState('HIGHEST RATED');
  const [bioExpanded, setBioExpanded] = useState(false);
  const [shaper, setShaper] = useState<Shaper | null>(null);
  const [allBoards, setAllBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    Promise.all([getShaper(supabase, id), getBoards(supabase)])
      .then(([s, bs]) => { if (s) setShaper(s); else setError(true); setAllBoards(bs); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const boards = useMemo(() => {
    if (!shaper) return [];
    const shaperBoards = allBoards.filter((b) => b.shaperId === shaper.id);
    if (sort === 'HIGHEST RATED') return [...shaperBoards].sort((a, b) => b.rating - a.rating);
    if (sort === 'MOST OPINIONED') return [...shaperBoards].sort((a, b) => b.opinionCount - a.opinionCount);
    return shaperBoards;
  }, [shaper, allBoards, sort]);

  if (error) {
    return (
      <Screen edges={['top']}>
        <View style={styles.state}>
          <GText variant="bodyL" color={colors.textMid}>Couldn't load this shaper.</GText>
          <Pressable onPress={load} hitSlop={8} style={styles.retry}><GText variant="label" color={colors.red}>TRY AGAIN</GText></Pressable>
        </View>
      </Screen>
    );
  }

  if (!shaper) {
    return (
      <Screen edges={[]}>
        <View style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}>
          <Skeleton height={28} width="50%" />
          <Skeleton height={40} width="70%" style={{ marginTop: spacing.md }} />
        </View>
        <View style={styles.loadingBody}><Skeleton height={64} /><Skeleton height={120} /></View>
      </Screen>
    );
  }

  const gridHeader = (
    <View>
      <View style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.nav}>
          <Pressable onPress={() => { tapHaptic(); navBack(router); }} style={({ pressed }) => [styles.navButton, pressed && styles.pressed]} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back">
            <CaretLeft size={20} color={colors.white} weight="bold" />
          </Pressable>
          <Pressable onPress={tapHaptic} style={({ pressed }) => [styles.navButton, pressed && styles.pressed]} hitSlop={8} accessibilityRole="button" accessibilityLabel="Share this shaper">
            <ShareNetwork size={20} color={colors.white} weight="regular" />
          </Pressable>
        </View>

        {shaper.logoUrl ? (
          <Image source={{ uri: shaper.logoUrl }} style={styles.avatar} contentFit="cover" transition={200} />
        ) : (
          <View style={styles.avatar}>
            <GText variant="displayXl" color={colors.white}>{shaper.name.charAt(0).toUpperCase()}</GText>
          </View>
        )}

        <GText variant="displayXl" color={colors.white}>{shaper.name.toUpperCase()}</GText>
        {shaper.location && (
          <GText variant="label" color={colors.white} style={styles.locationText}>{shaper.location.toUpperCase()}</GText>
        )}
        {shaper.bio && (
          <Pressable onPress={() => setBioExpanded(!bioExpanded)}>
            <GText variant="bodyM" color={colors.white} numberOfLines={bioExpanded ? undefined : 2} style={styles.bioText}>{shaper.bio}</GText>
          </Pressable>
        )}
      </View>

      <View style={styles.statsRow}>
        <StatBlock value={String(shaper.boardCount)} label="BOARDS" />
        <StatBlock value={shaper.avgRating.toFixed(1)} label="AVG RATING" />
        <StatBlock value={String(shaper.opinionCount)} label="OPINIONS" />
      </View>

      {shaper.topVibeTag && (
        <View style={styles.vibeTagRow}>
          <View style={styles.vibeTag}><GText variant="caption" color={colors.white}>{shaper.topVibeTag}</GText></View>
        </View>
      )}

      <View style={styles.sortSection}>
        <Chips options={SORT_OPTIONS} selected={sort} onSelect={setSort} />
      </View>
    </View>
  );

  return (
    <Screen edges={[]}>
      <FlatList
        data={boards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BoardTile board={item} />}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        ListHeaderComponent={gridHeader}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <GText variant="bodyM" color={colors.textMid}>No boards listed yet. Know one? Add it.</GText>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  state: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  retry: { paddingVertical: spacing.sm },
  loadingBody: { padding: spacing.lg, gap: spacing.md },
  pressed: { opacity: 0.6 },
  hero: { backgroundColor: colors.cardDark, padding: spacing.xl, gap: spacing.sm },
  nav: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  navButton: { padding: spacing.xs },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  locationText: { opacity: 0.7 },
  bioText: { opacity: 0.8, marginTop: spacing.xs },
  statsRow: { flexDirection: 'row' },
  vibeTagRow: { padding: spacing.xl, paddingBottom: 0 },
  vibeTag: { backgroundColor: colors.red, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 2, alignSelf: 'flex-start' },
  sortSection: { paddingVertical: spacing.md },
  gridContent: { gap: 2, paddingBottom: spacing.xl },
  gridRow: { gap: 2 },
  empty: { padding: spacing.xl, alignItems: 'center' },
});
