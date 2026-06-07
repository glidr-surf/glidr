import { useState } from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { GText } from './GText';
import { BoardTile } from './BoardTile';
import { OpinionCard } from './OpinionCard';
import { Skeleton } from './Skeleton';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import type { Board, Opinion } from '../types';

interface ProfileBoardsTabsProps {
  /** The screen-specific header rendered above the tabs (user card, stats, etc.). */
  header: React.ReactElement;
  quiverBoards: Board[];
  opinions: Opinion[];
  boardMap: Record<string, Board>;
  /** Owner viewing their own profile — enables edit/delete on opinions. */
  isOwn?: boolean;
  onEditOpinion?: (opinion: Opinion) => void;
  onDeleteOpinion?: (opinion: Opinion) => void;
  quiverEmpty: string;
  opinionsEmpty: string;
  loading?: boolean;
  /** Bottom inset for scroll content (e.g. floating tab-bar clearance). */
  bottomPadding?: number;
}

/**
 * Shared quiver/opinions tabbed lists for both the private and public profile screens.
 * Centralises the FlatList remount-on-numColumns fix and the "show the owner's own rating" logic.
 */
export function ProfileBoardsTabs({
  header,
  quiverBoards,
  opinions,
  boardMap,
  isOwn = false,
  onEditOpinion,
  onDeleteOpinion,
  quiverEmpty,
  opinionsEmpty,
  loading = false,
  bottomPadding = spacing.xl,
}: ProfileBoardsTabsProps) {
  const [tab, setTab] = useState<'quiver' | 'opinions'>('quiver');

  // quiver tiles show the profile owner's own rating, not the board's community average
  const myRating: Record<string, number> = {};
  for (const o of opinions) if (myRating[o.boardId] == null) myRating[o.boardId] = o.scores['overall_rating'] ?? 0;
  const quiver = quiverBoards.map((b) => ({ ...b, rating: myRating[b.id] ?? b.rating }));

  const headerEl = (
    <View>
      {header}
      <View style={styles.tabs}>
        <Pressable onPress={() => setTab('quiver')} style={[styles.tab, tab === 'quiver' && styles.tabActive]}>
          <GText variant="label" color={tab === 'quiver' ? colors.text : colors.textLight}>QUIVER</GText>
        </Pressable>
        <Pressable onPress={() => setTab('opinions')} style={[styles.tab, tab === 'opinions' && styles.tabActive]}>
          <GText variant="label" color={tab === 'opinions' ? colors.text : colors.textLight}>OPINIONS</GText>
        </Pressable>
      </View>
    </View>
  );

  const empty = (msg: string) =>
    loading ? (
      <View style={styles.loadingState}><Skeleton height={70} /><Skeleton height={70} /></View>
    ) : (
      <View style={styles.empty}><GText variant="bodyM" color={colors.textMid}>{msg}</GText></View>
    );

  // distinct `key` per tab forces a remount — RN can't change numColumns on the fly
  if (tab === 'opinions') {
    return (
      <FlatList
        key="opinions"
        data={opinions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OpinionCard
            opinion={item}
            board={boardMap[item.boardId]}
            showBoardInfo
            isOwn={isOwn}
            onEdit={isOwn && onEditOpinion ? () => onEditOpinion(item) : undefined}
            onDelete={isOwn && onDeleteOpinion ? () => onDeleteOpinion(item) : undefined}
          />
        )}
        ListHeaderComponent={headerEl}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={empty(opinionsEmpty)}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return (
    <FlatList
      key="quiver"
      data={quiver}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <BoardTile board={item} />}
      numColumns={3}
      columnWrapperStyle={styles.gridRow}
      ListHeaderComponent={headerEl}
      contentContainerStyle={[styles.gridContent, { paddingBottom: bottomPadding }]}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={empty(quiverEmpty)}
    />
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: colors.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.red },
  gridContent: { gap: 2 },
  gridRow: { gap: 2 },
  empty: { padding: spacing.xl, alignItems: 'center' },
  loadingState: { padding: spacing.xl, gap: spacing.md },
});
