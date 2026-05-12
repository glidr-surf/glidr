import { useState } from 'react';
import { View, FlatList, Pressable, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CaretLeft, ShareNetwork } from 'phosphor-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GText } from '../../src/components/GText';
import { SurfboardRating } from '../../src/components/SurfboardRating';
import { BoardTypeTag } from '../../src/components/BoardTypeTag';
import { StatBlock } from '../../src/components/StatBlock';
import { Chips } from '../../src/components/Chips';
import { OpinionCard } from '../../src/components/OpinionCard';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { mockBoards, mockOpinions, mockCurrentUser } from '../../src/data/mock';

const SORT_OPTIONS = ['RECENT', 'HELPFUL', 'CONTROVERSIAL'];

export default function BoardProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'opinions' | 'specs'>('opinions');
  const [sort, setSort] = useState('RECENT');

  const board = mockBoards.find((b) => b.id === id) ?? mockBoards[0];
  const opinions = mockOpinions.filter((o) => o.boardId === board.id);

  const sortedOpinions = [...opinions].sort((a, b) => {
    if (sort === 'HELPFUL') return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    if (sort === 'CONTROVERSIAL') return (b.downvotes / Math.max(b.upvotes, 1)) - (a.downvotes / Math.max(a.upvotes, 1));
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const withSpeed = opinions.filter((o) => o.speed != null);
  const withManoeuvre = opinions.filter((o) => o.manoeuvrability != null);
  const withPaddle = opinions.filter((o) => o.paddlePower != null);
  const avgSpeed = withSpeed.length > 0 ? withSpeed.reduce((s, o) => s + (o.speed ?? 0), 0) / withSpeed.length : 0;
  const avgManoeuvrability = withManoeuvre.length > 0 ? withManoeuvre.reduce((s, o) => s + (o.manoeuvrability ?? 0), 0) / withManoeuvre.length : 0;
  const avgPaddlePower = withPaddle.length > 0 ? withPaddle.reduce((s, o) => s + (o.paddlePower ?? 0), 0) / withPaddle.length : 0;

  const renderHeader = () => (
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

        <BoardTypeTag type={board.type} size="md" />
        <GText variant="displayXl" color={colors.white}>{board.name}</GText>
        <Pressable onPress={() => router.push(`/shaper/${board.shaperId}`)}>
          <GText variant="label" color={colors.red}>{board.shaper.toUpperCase()}</GText>
        </Pressable>
        {board.topVibeTag && (
          <View style={styles.heroVibeTag}>
            <GText variant="micro" color={colors.white}>{board.topVibeTag}</GText>
          </View>
        )}
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatBlock value={board.rating.toFixed(1)} label="RATING" />
        <StatBlock value={String(board.opinionCount)} label="OPINIONS" />
        <StatBlock value={`${board.buyAgainPercent}%`} label="BUY AGAIN" />
      </View>

      {/* Verdict */}
      <View style={styles.verdict}>
        {board.verdict ? (
          <>
            <GText variant="bodyL" color={colors.white}>"{board.verdict}"</GText>
            <GText variant="micro" color={colors.white} style={styles.verdictMeta}>
              GENERATED FROM {board.opinionCount} OPINIONS
            </GText>
          </>
        ) : (
          <GText variant="bodyM" color={colors.white}>
            Not enough opinions yet. Be the change.
          </GText>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable
          onPress={() => setActiveTab('opinions')}
          style={[styles.tab, activeTab === 'opinions' && styles.tabActive]}
        >
          <GText
            variant="label"
            color={activeTab === 'opinions' ? colors.text : colors.textLight}
          >
            OPINIONS
          </GText>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('specs')}
          style={[styles.tab, activeTab === 'specs' && styles.tabActive]}
        >
          <GText
            variant="label"
            color={activeTab === 'specs' ? colors.text : colors.textLight}
          >
            SPECS
          </GText>
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
        </View>
      )}
    </View>
  );

  if (activeTab === 'specs') {
    return (
      <View style={styles.screen}>
        <FlatList
          data={[]}
          renderItem={() => null}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
        />
        <View style={styles.stickyCta}>
          <Pressable style={styles.ctaButton} onPress={() => router.push('/(tabs)/rate')}>
            <GText variant="displayS" color={colors.white}>RATE THIS BOARD</GText>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={sortedOpinions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OpinionCard
            opinion={item}
            isOwn={item.userId === mockCurrentUser.id}
            onEdit={item.userId === mockCurrentUser.id ? () => router.push(('/rate-flow?boardId=' + item.boardId + '&opinionId=' + item.id) as any) : undefined}
            onDelete={item.userId === mockCurrentUser.id ? () => Alert.alert(
              'Delete Opinion',
              "Remove this opinion? The board won't miss you either.",
              [
                { text: 'KEEP IT', style: 'cancel' },
                { text: 'DELETE', style: 'destructive', onPress: () => {} },
              ],
            ) : undefined}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <GText variant="bodyM" color={colors.textMid}>
              No opinions yet. Someone paddle out and report back.
            </GText>
          </View>
        }
      />
      <View style={styles.stickyCta}>
        <Pressable style={styles.ctaButton} onPress={() => router.push('/(tabs)/rate')}>
          <GText variant="displayS" color={colors.white}>RATE THIS BOARD</GText>
        </Pressable>
      </View>
    </View>
  );
}

function PerformanceBar({ label, value, lowEnd, highEnd }: { label: string; value: number; lowEnd: string; highEnd: string }) {
  const percentage = (value / 10) * 100;
  return (
    <View style={perfStyles.container}>
      <View style={perfStyles.labelRow}>
        <GText variant="micro">{label}</GText>
        <GText variant="bodyS">{value.toFixed(1)}/10</GText>
      </View>
      <View style={perfStyles.track}>
        <View style={[perfStyles.fill, { width: `${percentage}%` }]} />
      </View>
      <View style={perfStyles.endLabels}>
        <GText variant="micro">{lowEnd}</GText>
        <GText variant="micro">{highEnd}</GText>
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
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  listContent: {
    paddingBottom: 80,
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
  heroVibeTag: {
    backgroundColor: colors.red,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
  },
  verdict: {
    backgroundColor: colors.cardDark,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  verdictMeta: {
    marginTop: spacing.xs,
    opacity: 0.6,
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
  sortSection: {
    paddingVertical: spacing.md,
  },
  specsSection: {
    padding: spacing.xl,
    gap: spacing.sm,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  stickyCta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.bg,
  },
  ctaButton: {
    backgroundColor: colors.red,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: 2,
  },
});
