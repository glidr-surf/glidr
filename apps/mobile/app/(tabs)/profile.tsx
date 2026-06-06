import { useState, useEffect, useMemo } from 'react';
import { View, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GearSix } from 'phosphor-react-native';
import { GText } from '../../src/components/GText';
import { StatBlock } from '../../src/components/StatBlock';
import { BoardTile } from '../../src/components/BoardTile';
import { OpinionCard } from '../../src/components/OpinionCard';
import { Screen } from '../../src/components/Screen';
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

  useEffect(() => {
    if (!user) return;
    getOpinions(supabase, { userId: user.id }).then((ops) =>
      setUserOpinions([...ops].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())),
    );
    getBoards(supabase).then(setBoards);
    computeBadges(supabase, user.id).then(setBadges);
  }, [user]);

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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.lg, padding: spacing.xl }}>
          <GText variant="displayL">WHO ARE YOU?</GText>
          <GText variant="bodyM" color={colors.textMid} style={{ textAlign: 'center' }}>
            Sign in to track your quiver, collect badges, and tell us what boards actually ride like.
          </GText>
          <Pressable
            style={{ backgroundColor: colors.red, paddingVertical: spacing.md, paddingHorizontal: spacing['2xl'], borderRadius: 2 }}
            onPress={showAuthModal}
          >
            <GText variant="displayS" color={colors.white}>SIGN IN</GText>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const renderHeader = () => (
    <View>
      {/* Settings */}
      <View style={styles.settingsRow}>
        <Pressable onPress={() => router.push('/settings')}>
          <GearSix size={24} color={colors.text} weight="regular" />
        </Pressable>
      </View>

      {/* User Card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <GText variant="displayXl" color={colors.white}>
            {user.username.charAt(0).toUpperCase()}
          </GText>
        </View>
        <GText variant="displayL" color={colors.white}>{user.username.toUpperCase()}</GText>
        <GText variant="label" color={colors.white} style={{ opacity: 0.7 }}>
          JOINED {joinDate.toUpperCase()}
        </GText>
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

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatBlock value={String(user.opinionCount)} label="BOARDS" />
        <StatBlock value={String(user.magicBoardCount)} label="MAGIC BOARDS" />
        <Pressable style={{ flex: 1 }} onPress={() => router.push('/badges')}>
          <StatBlock value={String(badgeCount)} label="BADGES" />
        </Pressable>
      </View>

      {/* Fun Line */}
      <View style={styles.funLine}>
        <GText variant="bodyM" color={colors.textMid}>
          You've opinioned {user.opinionCount} boards. Found {user.magicBoardCount} magic ones. Not bad.
        </GText>
      </View>

      {/* Tabs */}
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
      <SafeAreaView style={styles.safe} edges={['top']}>
        <FlatList
          data={userOpinions}
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
          ListEmptyComponent={
            <View style={styles.empty}>
              <GText variant="bodyM" color={colors.textMid}>
                No opinions yet. It's not you, it's the board. Oh wait.
              </GText>
            </View>
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
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
              No boards opinioned yet. Get out there.
            </GText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  settingsRow: {
    alignItems: 'flex-end',
    padding: spacing.xl,
    paddingBottom: 0,
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
  followRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
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
