import { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Pressable, StyleSheet, Alert, Share } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { CaretLeft, ShareNetwork } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '../../src/components/Screen';
import { GText } from '../../src/components/GText';
import { BoardTypeTag } from '../../src/components/BoardTypeTag';
import { StatBlock } from '../../src/components/StatBlock';
import { Chips } from '../../src/components/Chips';
import { OpinionCard } from '../../src/components/OpinionCard';
import { BoldBlock } from '../../src/components/BoldBlock';
import { Button } from '../../src/components/Button';
import { Skeleton } from '../../src/components/Skeleton';
import { pluralize } from '../../src/utils/pluralize';
import { navBack } from '../../src/utils/navBack';
import { aggregateSpecs } from '../../src/utils/opinionSpecs';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { boardTypeColors } from '../../src/theme/boardTypes';
import { consumeDirty, boardKey } from '../../src/lib/refreshBus';
import { getBoard, getOpinions, voteOnOpinion } from '@glidr/data';
import type { Board, Opinion } from '@glidr/data';
import { supabase } from '../../src/lib/supabase';

const SORT_OPTIONS = ['RECENT', 'HELPFUL', 'CONTROVERSIAL'];

const tapHaptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.specRow}>
      <GText variant="label" color={colors.textMid}>{k}</GText>
      <GText variant="bodyM">{v}</GText>
    </View>
  );
}

export default function BoardProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'opinions' | 'specs'>('opinions');
  const [sort, setSort] = useState('RECENT');
  const [board, setBoard] = useState<Board | null>(null);
  const [boardError, setBoardError] = useState(false);
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [loadingOps, setLoadingOps] = useState(true);
  const [opsError, setOpsError] = useState(false);
  const [myVotes, setMyVotes] = useState<Record<string, 1 | -1>>({});

  const { requireAuth, user } = useAuth();
  const insets = useSafeAreaInsets();

  const loadBoard = useCallback(() => {
    if (!id) return;
    setBoardError(false);
    getBoard(supabase, id)
      .then((b) => (b ? setBoard(b) : setBoardError(true)))
      .catch(() => setBoardError(true));
  }, [id]);

  const loadOps = useCallback(() => {
    if (!id) return;
    setLoadingOps(true);
    setOpsError(false);
    getOpinions(supabase, { boardId: id })
      .then(setOpinions)
      .catch(() => setOpsError(true))
      .finally(() => setLoadingOps(false));
  }, [id]);

  useEffect(() => { loadBoard(); loadOps(); }, [loadBoard, loadOps]);
  // on return, refetch only if an opinion was posted for this board (e.g. from the rate flow)
  useFocusEffect(
    useCallback(() => {
      if (consumeDirty(boardKey(id ?? ''))) { loadBoard(); loadOps(); }
    }, [id, loadBoard, loadOps]),
  );

  const onShare = () => {
    tapHaptic();
    if (!board) return;
    Share.share({ message: `${board.name} by ${board.shaper} on Glidr — https://glidr.surf/board/${board.id}` }).catch(() => {});
  };

  const handleVote = (opinionId: string, vote: 1 | -1) =>
    requireAuth(async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id;
      if (!userId) return;
      tapHaptic();
      const prev = myVotes[opinionId] ?? 0;
      if (prev === vote) return; // already voted this way
      // optimistic, in place — no full reload
      setOpinions((ops) =>
        ops.map((o) => {
          if (o.id !== opinionId) return o;
          let { upvotes, downvotes } = o;
          if (prev === 1) upvotes -= 1;
          if (prev === -1) downvotes -= 1;
          if (vote === 1) upvotes += 1;
          else downvotes += 1;
          return { ...o, upvotes, downvotes };
        }),
      );
      setMyVotes((m) => ({ ...m, [opinionId]: vote }));
      try {
        await voteOnOpinion(supabase, userId, opinionId, vote);
      } catch (e) {
        loadOps(); // reconcile on failure
        Alert.alert('Vote failed', e instanceof Error ? e.message : 'Try again.');
      }
    });

  const sortedOpinions = [...opinions].sort((a, b) => {
    if (sort === 'HELPFUL') return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    if (sort === 'CONTROVERSIAL') return (b.downvotes / Math.max(b.upvotes, 1)) - (a.downvotes / Math.max(a.upvotes, 1));
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const withSpeed = opinions.filter((o) => o.scores['speed'] != null);
  const withManoeuvre = opinions.filter((o) => o.scores['manoeuvrability'] != null);
  const withPaddle = opinions.filter((o) => o.scores['paddle_power'] != null);
  const avgSpeed = withSpeed.length > 0 ? withSpeed.reduce((s, o) => s + (o.scores['speed'] ?? 0), 0) / withSpeed.length : 0;
  const avgManoeuvrability = withManoeuvre.length > 0 ? withManoeuvre.reduce((s, o) => s + (o.scores['manoeuvrability'] ?? 0), 0) / withManoeuvre.length : 0;
  const avgPaddlePower = withPaddle.length > 0 ? withPaddle.reduce((s, o) => s + (o.scores['paddle_power'] ?? 0), 0) / withPaddle.length : 0;
  const specs = aggregateSpecs(opinions);

  if (boardError) {
    return (
      <Screen edges={['top']}>
        <View style={styles.state}>
          <GText variant="bodyL" color={colors.textMid}>Couldn't load this board.</GText>
          <Pressable onPress={loadBoard} hitSlop={8} style={styles.retry}>
            <GText variant="label" color={colors.red}>TRY AGAIN</GText>
          </Pressable>
        </View>
      </Screen>
    );
  }

  if (!board) {
    return (
      <Screen edges={[]}>
        <View style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}>
          <Skeleton height={28} width="60%" />
          <Skeleton height={48} width="80%" style={{ marginTop: spacing.md }} />
        </View>
        <View style={styles.loadingBody}>
          <Skeleton height={64} />
          <Skeleton height={110} />
          <Skeleton height={90} />
        </View>
      </Screen>
    );
  }

  const renderHeader = () => (
    <View>
      {/* Hero — light riso framed card */}
      <View style={[styles.hero, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.nav}>
          <Pressable
            onPress={() => { tapHaptic(); navBack(router); }}
            style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <CaretLeft size={22} color={colors.text} weight="bold" />
          </Pressable>
          <Pressable
            onPress={onShare}
            style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Share this board"
          >
            <ShareNetwork size={22} color={colors.text} weight="bold" />
          </Pressable>
        </View>

        <View style={styles.frameWrap}>
          <View style={styles.frameShadow} />
          <View style={styles.frame}>
            {board.imageUrl ? (
              <Image source={{ uri: board.imageUrl }} style={styles.frameImg} contentFit="contain" transition={200} />
            ) : (
              <View style={[styles.frameFallback, { backgroundColor: boardTypeColors[board.type] ?? colors.blue }]}>
                <GText variant="displayXl" color={colors.white}>{board.name.charAt(0).toUpperCase()}</GText>
              </View>
            )}
          </View>
        </View>

        <View style={styles.heroMeta}>
          <BoardTypeTag type={board.type} size="md" />
          <GText variant="displayXl">{board.name}</GText>
          <Pressable onPress={() => router.push(`/shaper/${board.shaperId}`)} accessibilityRole="link">
            <GText variant="label" color={colors.red}>{board.shaper.toUpperCase()}</GText>
          </Pressable>
          {board.topVibeTag && (
            <View style={styles.heroVibeTag}>
              <GText variant="caption" color={colors.textMid}>{board.topVibeTag}</GText>
            </View>
          )}
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatBlock value={board.rating.toFixed(1)} label="RATING" />
        <StatBlock value={String(board.opinionCount)} label="OPINIONS" />
        <StatBlock value={`${board.buyAgainPercent}%`} label="BUY AGAIN" />
      </View>

      {/* Verdict */}
      {board.verdict ? (
        <View style={styles.verdictWrap}>
          <BoldBlock tone="yellow" style={styles.verdict}>
            <GText variant="displayS" color={colors.text}>"{board.verdict}"</GText>
            <GText variant="caption" color={colors.text} style={styles.verdictMeta}>
              GENERATED FROM {pluralize(board.opinionCount, 'OPINION').toUpperCase()}
            </GText>
          </BoldBlock>
        </View>
      ) : (
        <View style={styles.verdictEmpty}>
          <GText variant="bodyM" color={colors.text}>Not enough opinions yet. Be the change.</GText>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable onPress={() => setActiveTab('opinions')} style={[styles.tab, activeTab === 'opinions' && styles.tabActive]}>
          <GText variant="label" color={activeTab === 'opinions' ? colors.text : colors.textLight}>OPINIONS</GText>
        </Pressable>
        <Pressable onPress={() => setActiveTab('specs')} style={[styles.tab, activeTab === 'specs' && styles.tabActive]}>
          <GText variant="label" color={activeTab === 'specs' ? colors.text : colors.textLight}>SPECS</GText>
        </Pressable>
      </View>

      {activeTab === 'opinions' && (
        <View style={styles.sortSection}>
          <Chips options={SORT_OPTIONS} selected={sort} onSelect={setSort} />
        </View>
      )}

      {activeTab === 'specs' && (
        <View style={styles.specsSection}>
          <GText variant="label">HOW IT RIDES</GText>
          <PerformanceBar label="SPEED" value={avgSpeed} lowEnd="ABSOLUTE BOG" highEnd="ABSOLUTELY FLYING" />
          <PerformanceBar label="MANOEUVRABILITY" value={avgManoeuvrability} lowEnd="BARGE" highEnd="WHIPPY AS" />
          <PerformanceBar label="PADDLE POWER" value={avgPaddlePower} lowEnd="ARM BURNER" highEnd="WAVE MAGNET" />
          {(specs.typicalFins || specs.bestIn || specs.quiverRole || specs.dimsRidden) && (
            <View style={styles.specRows}>
              <GText variant="label" style={styles.specsSubhead}>FROM THE OPINIONS</GText>
              {specs.typicalFins && <SpecRow k="TYPICAL FINS" v={specs.typicalFins} />}
              {specs.bestIn && <SpecRow k="BEST IN" v={specs.bestIn} />}
              {specs.quiverRole && <SpecRow k="QUIVER ROLE" v={specs.quiverRole} />}
              {specs.dimsRidden && <SpecRow k="DIMS RIDDEN" v={specs.dimsRidden} />}
            </View>
          )}
        </View>
      )}
    </View>
  );

  const cta = (
    <View style={[styles.stickyCta, { paddingBottom: insets.bottom + 12 }]}>
      <Button label="RATE THIS BOARD" onPress={() => { tapHaptic(); requireAuth(() => router.push(`/rate-flow?boardId=${board.id}` as any)); }} />
    </View>
  );

  const isOpinions = activeTab === 'opinions';

  return (
    <Screen edges={[]}>
      <StatusBar style="dark" />
      <FlatList
        data={isOpinions && !loadingOps ? sortedOpinions : []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.opinionItem}>
            <OpinionCard
              opinion={item}
              isOwn={item.userId === user?.id}
              onUpvote={() => handleVote(item.id, 1)}
              onDownvote={() => handleVote(item.id, -1)}
              onEdit={item.userId === user?.id ? () => router.push(('/rate-flow?boardId=' + item.boardId + '&opinionId=' + item.id) as any) : undefined}
              onDelete={item.userId === user?.id ? () => Alert.alert(
                'Delete Opinion',
                "Remove this opinion? The board won't miss you either.",
                [
                  { text: 'KEEP IT', style: 'cancel' },
                  { text: 'DELETE', style: 'destructive', onPress: () => {} },
                ],
              ) : undefined}
            />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !isOpinions ? null : loadingOps ? (
            <View style={styles.opsLoading}>
              <Skeleton height={90} />
              <Skeleton height={90} />
            </View>
          ) : opsError ? (
            <View style={styles.empty}>
              <GText variant="bodyM" color={colors.textMid}>Couldn't load opinions.</GText>
              <Pressable onPress={loadOps} hitSlop={8} style={styles.retry}>
                <GText variant="label" color={colors.red}>TRY AGAIN</GText>
              </Pressable>
            </View>
          ) : (
            <View style={styles.empty}>
              <GText variant="bodyM" color={colors.textMid}>No opinions yet. Someone paddle out and report back.</GText>
            </View>
          )
        }
      />
      {cta}
    </Screen>
  );
}

function PerformanceBar({ label, value, lowEnd, highEnd }: { label: string; value: number; lowEnd: string; highEnd: string }) {
  const percentage = (value / 10) * 100;
  return (
    <View style={perfStyles.container}>
      <View style={perfStyles.labelRow}>
        <GText variant="caption">{label}</GText>
        <GText variant="bodyM">{value.toFixed(1)}/10</GText>
      </View>
      <View style={perfStyles.track}>
        <View style={[perfStyles.fill, { width: `${percentage}%` }]} />
      </View>
      <View style={perfStyles.endLabels}>
        <GText variant="caption">{lowEnd}</GText>
        <GText variant="caption">{highEnd}</GText>
      </View>
    </View>
  );
}

const perfStyles = StyleSheet.create({
  container: { gap: 4, marginBottom: spacing.lg },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  track: { height: 6, backgroundColor: colors.borderSoft, borderRadius: 3 },
  fill: { height: 6, backgroundColor: colors.red, borderRadius: 3 },
  endLabels: { flexDirection: 'row', justifyContent: 'space-between' },
});

const styles = StyleSheet.create({
  listContent: { paddingBottom: 80 },
  pressed: { opacity: 0.6 },
  state: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  retry: { paddingVertical: spacing.sm },
  loadingBody: { padding: spacing.lg, gap: spacing.md },
  opsLoading: { padding: spacing.lg, gap: spacing.md },
  hero: {
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  nav: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  navButton: { padding: spacing.xs },
  frameWrap: { position: 'relative', marginRight: 6, marginBottom: 6 },
  frameShadow: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, backgroundColor: colors.text, borderRadius: 4 },
  frame: { height: 240, backgroundColor: colors.surface, borderWidth: 2.5, borderColor: colors.text, borderRadius: 4, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  frameImg: { width: '100%', height: '100%' },
  frameFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  heroMeta: { marginTop: spacing.lg, gap: spacing.xs, alignItems: 'flex-start' },
  heroVibeTag: { backgroundColor: colors.surfaceCard, borderWidth: 1, borderColor: colors.borderSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 2, alignSelf: 'flex-start', marginTop: spacing.xs },
  statsRow: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: colors.text },
  verdictWrap: { margin: spacing.lg },
  verdict: { padding: spacing.lg, gap: spacing.sm },
  verdictEmpty: { margin: spacing.lg, padding: spacing.lg, backgroundColor: colors.surfaceCard, borderWidth: 1.5, borderColor: colors.borderSoft, borderRadius: 4 },
  verdictMeta: { marginTop: spacing.xs, opacity: 0.6 },
  tabs: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: colors.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.red },
  sortSection: { paddingVertical: spacing.md },
  specsSection: { padding: spacing.xl, gap: spacing.sm },
  specRows: { marginTop: spacing.lg, gap: 0 },
  specsSubhead: { marginBottom: spacing.sm },
  specRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  opinionItem: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  empty: { padding: spacing.xl, alignItems: 'center', gap: spacing.md },
  stickyCta: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: spacing.lg, paddingTop: spacing.md, backgroundColor: colors.bg },
});
