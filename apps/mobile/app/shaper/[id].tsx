import { useState, useEffect, useMemo } from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CaretLeft, ShareNetwork } from 'phosphor-react-native';
import { GText } from '../../src/components/GText';
import { StatBlock } from '../../src/components/StatBlock';
import { BoardTile } from '../../src/components/BoardTile';
import { Chips } from '../../src/components/Chips';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { getShaper, getBoards } from '@glidr/data';
import type { Shaper, Board } from '@glidr/data';
import { supabase } from '../../src/lib/supabase';

const SORT_OPTIONS = ['HIGHEST RATED', 'MOST OPINIONED', 'NEWEST'];

export default function ShaperScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [sort, setSort] = useState('HIGHEST RATED');
  const [bioExpanded, setBioExpanded] = useState(false);
  const [shaper, setShaper] = useState<Shaper | null>(null);
  const [allBoards, setAllBoards] = useState<Board[]>([]);

  useEffect(() => {
    if (!id) return;
    getShaper(supabase, id).then((s) => { if (s) setShaper(s); });
    getBoards(supabase).then(setAllBoards);
  }, [id]);

  const boards = useMemo(() => {
    if (!shaper) return [];
    const shaperBoards = allBoards.filter((b) => b.shaperId === shaper.id);
    if (sort === 'HIGHEST RATED') return [...shaperBoards].sort((a, b) => b.rating - a.rating);
    if (sort === 'MOST OPINIONED') return [...shaperBoards].sort((a, b) => b.opinionCount - a.opinionCount);
    return shaperBoards;
  }, [shaper, allBoards, sort]);

  if (!shaper) return null;

  const gridHeader = (
    <View>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.nav}>
          <Pressable onPress={() => router.back()} style={styles.navButton}>
            <CaretLeft size={20} color={colors.white} weight="bold" />
          </Pressable>
          <Pressable style={styles.navButton}>
            <ShareNetwork size={20} color={colors.white} weight="regular" />
          </Pressable>
        </View>

        <View style={styles.avatar}>
          <GText variant="displayXl" color={colors.white}>
            {shaper.name.charAt(0).toUpperCase()}
          </GText>
        </View>

        <GText variant="displayXl" color={colors.white}>{shaper.name.toUpperCase()}</GText>
        {shaper.location && (
          <GText variant="label" color={colors.white} style={styles.locationText}>
            {shaper.location.toUpperCase()}
          </GText>
        )}
        {shaper.bio && (
          <Pressable onPress={() => setBioExpanded(!bioExpanded)}>
            <GText
              variant="bodyM"
              color={colors.white}
              numberOfLines={bioExpanded ? undefined : 2}
              style={styles.bioText}
            >
              {shaper.bio}
            </GText>
          </Pressable>
        )}
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatBlock value={String(shaper.boardCount)} label="BOARDS" />
        <StatBlock value={shaper.avgRating.toFixed(1)} label="AVG RATING" />
        <StatBlock value={String(shaper.opinionCount)} label="OPINIONS" />
      </View>

      {/* Top Vibe Tag */}
      {shaper.topVibeTag && (
        <View style={styles.vibeTagRow}>
          <View style={styles.vibeTag}>
            <GText variant="caption" color={colors.white}>{shaper.topVibeTag}</GText>
          </View>
        </View>
      )}

      {/* Sort Chips */}
      <View style={styles.sortSection}>
        <Chips options={SORT_OPTIONS} selected={sort} onSelect={setSort} />
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
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
            <GText variant="bodyM" color={colors.textMid}>
              No boards listed yet. Know one? Add it.
            </GText>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  hero: {
    backgroundColor: colors.cardDark,
    padding: spacing.xl,
    paddingTop: 60,
    gap: spacing.sm,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  navButton: {
    padding: spacing.xs,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  locationText: {
    opacity: 0.7,
  },
  bioText: {
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
  },
  vibeTagRow: {
    padding: spacing.xl,
    paddingBottom: 0,
  },
  vibeTag: {
    backgroundColor: colors.red,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
    alignSelf: 'flex-start',
  },
  sortSection: {
    paddingVertical: spacing.md,
  },
  gridContent: {
    gap: 2,
    paddingBottom: spacing.xl,
  },
  gridRow: {
    gap: 2,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
});
