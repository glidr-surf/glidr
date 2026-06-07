import { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { CaretLeft } from 'phosphor-react-native';
import { Screen } from '../../src/components/Screen';
import { GText } from '../../src/components/GText';
import { StatBlock } from '../../src/components/StatBlock';
import { BoardTile } from '../../src/components/BoardTile';
import { OpinionCard } from '../../src/components/OpinionCard';
import { Skeleton } from '../../src/components/Skeleton';
import { navBack } from '../../src/utils/navBack';
import { boardOpinionPhrase } from '../../src/utils/boardOpinions';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { getOpinions, getBoards } from '@glidr/data';
import type { Board, Opinion } from '@glidr/data';
import { supabase } from '../../src/lib/supabase';

const tapHaptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'quiver' | 'opinions'>('quiver');
  const [following, setFollowing] = useState(false);
  const [userOpinions, setUserOpinions] = useState<Opinion[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    Promise.all([getOpinions(supabase, { userId: id }), getBoards(supabase)])
      .then(([ops, bs]) => {
        setUserOpinions([...ops].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setBoards(bs);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

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

  if (error) {
    return (
      <Screen edges={['top']}>
        <View style={styles.state}>
          <GText variant="bodyL" color={colors.textMid}>Couldn't load this profile.</GText>
          <Pressable onPress={load} hitSlop={8} style={styles.retry}><GText variant="label" color={colors.red}>TRY AGAIN</GText></Pressable>
        </View>
      </Screen>
    );
  }

  if (loading && userOpinions.length === 0) {
    return (
      <Screen edges={['top']}>
        <View style={styles.loadingBody}><Skeleton height={90} /><Skeleton height={64} /><Skeleton height={120} /></View>
      </Screen>
    );
  }

  const renderHeader = () => (
    <View>
      <View style={styles.nav}>
        <Pressable onPress={() => { tapHaptic(); navBack(router); }} style={({ pressed }) => [styles.navButton, pressed && styles.pressed]} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back">
          <CaretLeft size={20} color={colors.text} weight="bold" />
        </Pressable>
      </View>

      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <GText variant="displayXl" color={colors.white}>{username.charAt(0).toUpperCase()}</GText>
        </View>
        <GText variant="displayL" color={colors.white}>{username.toUpperCase()}</GText>
        <Pressable
          onPress={() => { tapHaptic(); setFollowing(!following); }}
          style={[styles.followButton, following && styles.followButtonActive]}
          accessibilityRole="button"
        >
          <GText variant="caption" color={following ? colors.white : colors.red}>{following ? 'FOLLOWING' : 'FOLLOW'}</GText>
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <StatBlock value={String(boardIds.length)} label="BOARDS" />
        <StatBlock value={String(magicCount)} label="MAGIC BOARDS" />
        <StatBlock value="—" label="BADGES" />
      </View>

      <View style={styles.funLine}>
        <GText variant="bodyM" color={colors.textMid}>
          {username} has {boardOpinionPhrase(boardIds.length)}. Favourite shaper: {topShaper}. Probably owns a van.
        </GText>
      </View>

      <View style={styles.tabs}>
        <Pressable onPress={() => setActiveTab('quiver')} style={[styles.tab, activeTab === 'quiver' && styles.tabActive]}>
          <GText variant="label" color={activeTab === 'quiver' ? colors.text : colors.textLight}>QUIVER</GText>
        </Pressable>
        <Pressable onPress={() => setActiveTab('opinions')} style={[styles.tab, activeTab === 'opinions' && styles.tabActive]}>
          <GText variant="label" color={activeTab === 'opinions' ? colors.text : colors.textLight}>OPINIONS</GText>
        </Pressable>
      </View>
    </View>
  );

  if (activeTab === 'opinions') {
    return (
      <Screen edges={['top']}>
        <FlatList
          data={userOpinions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OpinionCard opinion={item} board={boardMap[item.boardId]} showBoardInfo />}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          ListEmptyComponent={<View style={styles.empty}><GText variant="bodyM" color={colors.textMid}>No opinions yet. They're probably still waxing up.</GText></View>}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={['top']}>
      <FlatList
        data={quiverBoards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BoardTile board={item} />}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<View style={styles.empty}><GText variant="bodyM" color={colors.textMid}>No boards opinioned yet.</GText></View>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  state: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  retry: { paddingVertical: spacing.sm },
  loadingBody: { padding: spacing.lg, gap: spacing.md },
  pressed: { opacity: 0.6 },
  nav: { padding: spacing.xl, paddingBottom: 0 },
  navButton: { padding: spacing.xs },
  userCard: { backgroundColor: colors.cardDark, padding: spacing.xl, alignItems: 'center', gap: spacing.xs },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  followButton: { borderWidth: 1, borderColor: colors.red, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: 2, marginTop: spacing.sm },
  followButtonActive: { backgroundColor: colors.red, borderColor: colors.red },
  statsRow: { flexDirection: 'row' },
  funLine: { padding: spacing.xl },
  tabs: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: colors.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.red },
  listContent: { paddingBottom: spacing.xl },
  gridContent: { gap: 2, paddingBottom: spacing.xl },
  gridRow: { gap: 2 },
  empty: { padding: spacing.xl, alignItems: 'center' },
});
