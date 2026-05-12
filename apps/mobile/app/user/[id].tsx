import { useState, useEffect, useMemo } from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import { GText } from '../../src/components/GText';
import { StatBlock } from '../../src/components/StatBlock';
import { BoardTile } from '../../src/components/BoardTile';
import { OpinionCard } from '../../src/components/OpinionCard';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { getOpinions, getBoards } from '@glidr/data';
import type { Board, Opinion } from '@glidr/data';
import { supabase } from '../../src/lib/supabase';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'quiver' | 'opinions'>('quiver');
  const [following, setFollowing] = useState(false);
  const [userOpinions, setUserOpinions] = useState<Opinion[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    if (!id) return;
    getOpinions(supabase, { userId: id }).then((ops) =>
      setUserOpinions([...ops].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())),
    );
    getBoards(supabase).then(setBoards);
  }, [id]);

  const boardMap = Object.fromEntries(boards.map((b) => [b.id, b]));

  const username = userOpinions[0]?.username ?? 'Unknown';
  const boardIds = [...new Set(userOpinions.map((o) => o.boardId))];
  const quiverBoards = boardIds.map((bid) => boardMap[bid]).filter(Boolean);
  const magicCount = userOpinions.filter((o) => (o.scores['overall_rating'] ?? 0) === 5).length;

  const shaperCounts: Record<string, number> = {};
  for (const o of userOpinions) {
    const board = boardMap[o.boardId];
    if (board) shaperCounts[board.shaper] = (shaperCounts[board.shaper] ?? 0) + 1;
  }
  const topShaper = Object.entries(shaperCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'unknown';

  const renderHeader = () => (
    <View>
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()} style={styles.navButton}>
          <CaretLeft size={20} color={colors.text} weight="bold" />
        </Pressable>
      </View>

      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <GText variant="displayXl" color={colors.white}>
            {username.charAt(0).toUpperCase()}
          </GText>
        </View>
        <GText variant="displayL" color={colors.white}>{username.toUpperCase()}</GText>
        <Pressable
          onPress={() => setFollowing(!following)}
          style={[styles.followButton, following && styles.followButtonActive]}
        >
          <GText variant="caption" color={following ? colors.white : colors.red}>
            {following ? 'FOLLOWING' : 'FOLLOW'}
          </GText>
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <StatBlock value={String(boardIds.length)} label="BOARDS" />
        <StatBlock value={String(magicCount)} label="MAGIC BOARDS" />
        <StatBlock value="—" label="BADGES" />
      </View>

      <View style={styles.funLine}>
        <GText variant="bodyM" color={colors.textMid}>
          {username} has opinioned {boardIds.length} boards. Favourite shaper: {topShaper}. Probably owns a van.
        </GText>
      </View>

      <View style={styles.tabs}>
        <Pressable
          onPress={() => setActiveTab('quiver')}
          style={[styles.tab, activeTab === 'quiver' && styles.tabActive]}
        >
          <GText variant="label" color={activeTab === 'quiver' ? colors.text : colors.textLight}>
            QUIVER
          </GText>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('opinions')}
          style={[styles.tab, activeTab === 'opinions' && styles.tabActive]}
        >
          <GText variant="label" color={activeTab === 'opinions' ? colors.text : colors.textLight}>
            OPINIONS
          </GText>
        </Pressable>
      </View>
    </View>
  );

  if (activeTab === 'opinions') {
    return (
      <View style={styles.screen}>
        <FlatList
          data={userOpinions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OpinionCard
              opinion={item}
              board={boardMap[item.boardId]}
              showBoardInfo
            />
          )}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <GText variant="bodyM" color={colors.textMid}>
                No opinions yet. They're probably still waxing up.
              </GText>
            </View>
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={quiverBoards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BoardTile board={item} />}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <GText variant="bodyM" color={colors.textMid}>
              No boards opinioned yet.
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
  nav: {
    padding: spacing.xl,
    paddingBottom: 0,
    paddingTop: 60,
  },
  navButton: {
    padding: spacing.xs,
  },
  userCard: {
    backgroundColor: colors.cardDark,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  followButton: {
    borderWidth: 1,
    borderColor: colors.red,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: 2,
    marginTop: spacing.sm,
  },
  followButtonActive: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  statsRow: {
    flexDirection: 'row',
  },
  funLine: {
    padding: spacing.xl,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.red,
  },
  listContent: {
    paddingBottom: spacing.xl,
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
