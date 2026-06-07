import { useState, useEffect, useMemo, useCallback } from 'react';
import { View, FlatList, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { MagnifyingGlass } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Screen } from '../../src/components/Screen';
import { GText } from '../../src/components/GText';
import { BoardTile } from '../../src/components/BoardTile';
import { BoardTypeTag } from '../../src/components/BoardTypeTag';
import { BoldBlock } from '../../src/components/BoldBlock';
import { GlidrMark } from '../../src/components/GlidrMark';
import { Skeleton } from '../../src/components/Skeleton';
import { Stars } from '../../src/components/Stars';
import { pluralize } from '../../src/utils/pluralize';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { TAB_BAR_CLEARANCE } from '../../src/theme/layout';
import { getBoards } from '@glidr/data';
import type { Board } from '@glidr/data';
import { supabase } from '../../src/lib/supabase';

const SKELETON_TILES = [{ id: 's1' }, { id: 's2' }, { id: 's3' }, { id: 's4' }];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback((mode: 'initial' | 'refresh' = 'initial') => {
    if (mode === 'refresh') setRefreshing(true); else setLoading(true);
    setError(false);
    getBoards(supabase)
      .then((b) => setBoards(b))
      .catch(() => setError(true))
      .finally(() => { setLoading(false); setRefreshing(false); });
  }, []);

  useEffect(() => { load('initial'); }, [load]);

  const ranked = useMemo(() => [...boards].sort((a, b) => b.rating - a.rating), [boards]);
  const featured = ranked[0];
  const lineup = ranked.slice(1);
  const showSkeleton = loading && boards.length === 0;

  const header = (
    <View>
      <View style={[styles.headerBar, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.logoRow}>
          <GlidrMark size={34} />
          <GText variant="displayL" color={colors.surface} style={styles.logo}>GLIDR</GText>
        </View>
        <Pressable testID="header-search" onPress={() => router.push('/search')} hitSlop={12} accessibilityRole="button" accessibilityLabel="Search boards and shapers">
          <MagnifyingGlass size={24} color={colors.surface} weight="bold" />
        </Pressable>
      </View>

      <View style={styles.body}>
        {showSkeleton ? (
          <Skeleton height={249} style={styles.heroSkeleton} />
        ) : featured ? (
          <Pressable
            testID={`board-tile-${featured.id}`}
            style={({ pressed }) => [styles.posterWrap, pressed && styles.pressed]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/board/${featured.id}`); }}
          >
            <BoldBlock tone="ink">
              {featured.imageUrl ? (
                <Image source={{ uri: featured.imageUrl }} style={styles.posterImg} contentFit="cover" contentPosition="top" transition={200} />
              ) : (
                <View style={[styles.posterImg, styles.posterFallback]}>
                  <GText variant="displayXl" color={colors.surface}>{featured.name.charAt(0)}</GText>
                </View>
              )}
              <View style={styles.posterTag}><BoardTypeTag type={featured.type} size="sm" /></View>
              <GText variant="displayXl" color={colors.yellow} style={styles.rank}>#1</GText>
              <View style={styles.posterCap}>
                <GText variant="displayM" color={colors.surface} numberOfLines={1}>{featured.name}</GText>
                <View style={styles.posterMeta}>
                  <Stars rating={featured.rating} size={16} color={colors.yellow} />
                  <GText variant="caption" color={colors.yellow}>
                    {featured.shaper.toUpperCase()} · {pluralize(featured.opinionCount, 'OPINION').toUpperCase()}
                  </GText>
                </View>
              </View>
            </BoldBlock>
          </Pressable>
        ) : null}

        {(showSkeleton || featured) && <GText variant="label" style={styles.lineupLabel}>THE LINEUP</GText>}
      </View>
    </View>
  );

  return (
    <Screen edges={[]}>
      <StatusBar style="light" />
      <FlatList
        data={showSkeleton ? SKELETON_TILES : lineup}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) =>
          showSkeleton ? <Skeleton height={170} style={styles.tileSkeleton} /> : <BoardTile board={item as Board} />
        }
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        ListHeaderComponent={header}
        ListEmptyComponent={
          error ? (
            <View style={styles.state}>
              <GText variant="bodyL" color={colors.textMid}>Couldn't load the lineup.</GText>
              <Pressable onPress={() => load('initial')} hitSlop={8} style={styles.retry}>
                <GText variant="label" color={colors.red}>TRY AGAIN</GText>
              </Pressable>
            </View>
          ) : !showSkeleton ? (
            <View style={styles.state}>
              <GText variant="bodyL" color={colors.textMid}>No boards yet — paddle out and add one.</GText>
            </View>
          ) : null
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load('refresh')} tintColor={colors.red} />}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerBar: { backgroundColor: colors.red, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logo: { letterSpacing: 2 },
  body: { padding: spacing.lg },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  posterWrap: { marginBottom: spacing.xl },
  posterImg: { width: '100%', height: 215 },
  posterFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blue },
  posterTag: { position: 'absolute', top: 10, left: 10 },
  rank: { position: 'absolute', top: 4, right: 12 },
  posterCap: { backgroundColor: colors.cardDark, padding: spacing.md },
  posterMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 6 },
  heroSkeleton: { marginBottom: spacing.xl },
  lineupLabel: { marginBottom: spacing.md },
  tileSkeleton: { flex: 1 },
  grid: { paddingBottom: TAB_BAR_CLEARANCE },
  gridRow: { gap: spacing.lg, marginBottom: spacing.lg, paddingHorizontal: spacing.lg },
  state: { padding: spacing.xl, alignItems: 'center', gap: spacing.md },
  retry: { paddingVertical: spacing.sm },
});
