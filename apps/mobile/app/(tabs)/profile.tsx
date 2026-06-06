import { useState, useEffect, useMemo, useCallback } from 'react';
import { View, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { GearSix } from 'phosphor-react-native';
import { GText } from '../../src/components/GText';
import { StatBlock } from '../../src/components/StatBlock';
import { BoardTile } from '../../src/components/BoardTile';
import { OpinionCard } from '../../src/components/OpinionCard';
import { Screen } from '../../src/components/Screen';
import { Skeleton } from '../../src/components/Skeleton';
import { pluralize } from '../../src/utils/pluralize';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { getOpinions, getBoards, computeBadges } from '@glidr/data';
import type { Board, Opinion, Badge } from '@glidr/data';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { isAuthenticated, showAuthModal, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'quiver' | 'opinions'>('quiver');
  const [userOpinions, setUserOpinions] = useState<Opinion[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    if (!user) return;
    setLoading(true);
    setError(false);
    Promise.all([
      getOpinions(supabase, { userId: user.id }),
      getBoards(supabase),
      computeBadges(supabase, user.id),
    ])
      .then(([ops, bs, bg]) => {
        setUserOpinions([...ops].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setBoards(bs);
        setBadges(bg);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const boardMap = Object.fromEntries(boards.map((b) => [b.id, b]));

  const quiverBoards = useMemo(() => {
    const boardIds = [...new Set(userOpinions.map((o) => o.boardId))];
    return boardIds.map((id) => boardMap[id]).filter(Boolean);
  }, [userOpinions, boardMap]);

  const badgeCount = badges.filter((b) => b.earned).length;
  const joinDate = user
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  if (!isAuthenticated || !user) {
    return (
      <Screen>
        <View style={styles.signedOut}>
          <GText variant="displayL">WHO ARE YOU?</GText>
          <GText variant="bodyM" color={colors.textMid} style={{ textAlign: 'center' }}>
            Sign in to track your quiver, collect badges, and tell us what boards actually ride like.
          </GText>
          <Pressable style={styles.signInBtn} onPress={showAuthModal}>
            <GText variant="displayS" color={colors.white}>SIGN IN</GText>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const renderHeader = () => (
    <View>
      <View style={styles.settingsRow}>
        <Pressable onPress={() => router.push('/settings')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Settings">
          <GearSix size={24} color={colors.text} weight="regular" />
        </Pressable>
      </View>

      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <GText variant="displayXl" color={colors.white}>{user.username.charAt(0).toUpperCase()}</GText>
        </View>
        <GText variant="displayL" color={colors.white}>{user.username.toUpperCase()}</GText>
        <GText variant="label" color={colors.white} style={{ opacity: 0.7 }}>JOINED {joinDate.toUpperCase()}</GText>
        {(user.height || user.weight) && (
          <GText variant="caption" color={colors.white} style={{ opacity: 0.7 }}>
            {[user.height, user.weight].filter(Boolean).join(' · ')}
          </GText>
        )}
        <View style={styles.followRow}>
          <GText variant="bodyM" color={colors.white}>{user.followingCount} following</GText>
          <GText variant="bodyM" color={colors.white}>·</GText>
          <GText variant="bodyM" color={colors.white}>{user.followersCount} followers</GText>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatBlock value={String(user.opinionCount)} label="BOARDS" />
        <StatBlock value={String(user.magicBoardCount)} label="MAGIC BOARDS" />
        <Pressable style={{ flex: 1 }} onPress={() => router.push('/badges')}>
          <StatBlock value={String(badgeCount)} label="BADGES" />
        </Pressable>
      </View>

      <View style={styles.funLine}>
        <GText variant="bodyM" color={colors.textMid}>
          You've opinioned {pluralize(user.opinionCount, 'board')}. Found {pluralize(user.magicBoardCount, 'magic one', 'magic ones')}. Not bad.
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

  const emptyState = (copy: string) =>
    loading ? (
      <View style={styles.loadingState}>
        <Skeleton height={70} />
        <Skeleton height={70} />
      </View>
    ) : error ? (
      <View style={styles.empty}>
        <GText variant="bodyM" color={colors.textMid}>Couldn't load your profile.</GText>
        <Pressable onPress={load} hitSlop={8} style={styles.retry}><GText variant="label" color={colors.red}>TRY AGAIN</GText></Pressable>
      </View>
    ) : (
      <View style={styles.empty}><GText variant="bodyM" color={colors.textMid}>{copy}</GText></View>
    );

  if (activeTab === 'opinions') {
    return (
      <Screen edges={['top']}>
        <FlatList
          data={loading ? [] : userOpinions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OpinionCard
              opinion={item}
              board={boardMap[item.boardId]}
              showBoardInfo
              isOwn
              onEdit={() => router.push(('/rate-flow?boardId=' + item.boardId + '&opinionId=' + item.id) as any)}
              onDelete={() => Alert.alert(
                'Delete Opinion',
                "Remove this opinion? The board won't miss you either.",
                [
                  { text: 'KEEP IT', style: 'cancel' },
                  { text: 'DELETE', style: 'destructive', onPress: () => {} },
                ],
              )}
            />
          )}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          ListEmptyComponent={emptyState("No opinions yet. It's not you, it's the board. Oh wait.")}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={['top']}>
      <FlatList
        data={loading ? [] : quiverBoards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BoardTile board={item} />}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={emptyState('No boards opinioned yet. Get out there.')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  signedOut: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.lg, padding: spacing.xl },
  signInBtn: { backgroundColor: colors.red, paddingVertical: spacing.md, paddingHorizontal: spacing['2xl'], borderRadius: 2 },
  settingsRow: { alignItems: 'flex-end', padding: spacing.xl, paddingBottom: 0 },
  userCard: { backgroundColor: colors.cardDark, padding: spacing.xl, alignItems: 'center', gap: spacing.xs },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  followRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  statsRow: { flexDirection: 'row' },
  funLine: { padding: spacing.xl },
  tabs: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: colors.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.red },
  listContent: { paddingBottom: spacing.xl },
  gridContent: { gap: 2, paddingBottom: spacing.xl },
  gridRow: { gap: 2 },
  empty: { padding: spacing.xl, alignItems: 'center', gap: spacing.md },
  loadingState: { padding: spacing.xl, gap: spacing.md },
  retry: { paddingVertical: spacing.sm },
});
