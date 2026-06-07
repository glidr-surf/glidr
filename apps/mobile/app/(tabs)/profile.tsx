import { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GearSix, Camera } from 'phosphor-react-native';
import { Image } from 'expo-image';
import { GText } from '../../src/components/GText';
import { StatBlock } from '../../src/components/StatBlock';
import { ProfileBoardsTabs } from '../../src/components/ProfileBoardsTabs';
import { Screen } from '../../src/components/Screen';
import { pluralize } from '../../src/utils/pluralize';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { TAB_BAR_CLEARANCE } from '../../src/theme/layout';
import { boardOpinionPhrase } from '../../src/utils/boardOpinions';
import { pickImage } from '../../src/lib/pickImage';
import { consumeDirty, PROFILE_KEY } from '../../src/lib/refreshBus';
import { getOpinions, getBoards, computeBadges, uploadImage } from '@glidr/data';
import type { Board, Opinion, Badge } from '@glidr/data';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, showAuthModal, user, refreshUser } = useAuth();
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
  // refetch on focus only after a mutation (e.g. posting an opinion)
  useFocusEffect(useCallback(() => { if (consumeDirty(PROFILE_KEY)) load(); }, [load]));

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

  const changePhoto = async () => {
    if (!user) return;
    const img = await pickImage();
    if (!img) return;
    try {
      await uploadImage(supabase, { ownerType: 'profile', ownerId: user.id, file: img.blob, ext: img.ext, contentType: img.contentType, replace: true });
      await refreshUser();
    } catch {
      Alert.alert('Upload failed', 'Could not update your photo. Have another go.');
    }
  };

  const renderHeader = () => (
    <View>
      <View style={[styles.userCard, { paddingTop: insets.top + spacing.md }]}>
        <Pressable style={styles.gear} onPress={() => router.push('/settings')} hitSlop={10} accessibilityRole="button" accessibilityLabel="Settings">
          <GearSix size={26} color={colors.white} weight="bold" />
        </Pressable>
        <Pressable style={styles.avatarWrap} onPress={changePhoto} accessibilityRole="button" accessibilityLabel="Change profile photo">
          <View style={styles.avatar}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatarImg} contentFit="cover" />
            ) : (
              <GText variant="displayXl" color={colors.white}>{user.username.charAt(0).toUpperCase()}</GText>
            )}
          </View>
          <View style={styles.cameraBadge}><Camera size={13} color={colors.white} weight="fill" /></View>
        </Pressable>
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
          You have {boardOpinionPhrase(user.opinionCount)}. Found {pluralize(user.magicBoardCount, 'magic one', 'magic ones')}. Not bad.
        </GText>
      </View>

    </View>
  );

  if (error) {
    return (
      <Screen edges={[]}>
        <StatusBar style="light" />
        <View style={styles.signedOut}>
          <GText variant="bodyM" color={colors.textMid}>Couldn't load your profile.</GText>
          <Pressable onPress={load} hitSlop={8} style={styles.retry}><GText variant="label" color={colors.red}>TRY AGAIN</GText></Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={[]}>
      <StatusBar style="light" />
      <ProfileBoardsTabs
        header={renderHeader()}
        quiverBoards={quiverBoards}
        opinions={userOpinions}
        boardMap={boardMap}
        isOwn
        loading={loading}
        bottomPadding={TAB_BAR_CLEARANCE}
        quiverEmpty="No boards opinioned yet. Get out there."
        opinionsEmpty="No opinions yet. It's not you, it's the board. Oh wait."
        onEditOpinion={(op) => router.push(('/rate-flow?boardId=' + op.boardId + '&opinionId=' + op.id) as any)}
        onDeleteOpinion={() => Alert.alert(
          'Delete Opinion',
          "Remove this opinion? The board won't miss you either.",
          [
            { text: 'KEEP IT', style: 'cancel' },
            { text: 'DELETE', style: 'destructive', onPress: () => {} },
          ],
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  signedOut: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.lg, padding: spacing.xl },
  signInBtn: { backgroundColor: colors.red, paddingVertical: spacing.md, paddingHorizontal: spacing['2xl'], borderRadius: 2 },
  gear: { alignSelf: 'flex-end' },
  userCard: { backgroundColor: colors.red, paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, alignItems: 'center', gap: spacing.xs },
  avatarWrap: { marginBottom: spacing.sm },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImg: { width: 72, height: 72 },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.red },
  followRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  statsRow: { flexDirection: 'row' },
  funLine: { padding: spacing.xl },
  retry: { paddingVertical: spacing.sm },
});
