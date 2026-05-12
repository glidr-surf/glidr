import { useState, useMemo } from 'react';
import { View, TextInput, FlatList, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MagnifyingGlass } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { GText } from '../../src/components/GText';
import { Chips } from '../../src/components/Chips';
import { BoardTile } from '../../src/components/BoardTile';
import { ShaperPill } from '../../src/components/ShaperPill';
import { BoardTypeTag } from '../../src/components/BoardTypeTag';
import { SurfboardRating } from '../../src/components/SurfboardRating';
import { formatRelativeTime } from '../../src/utils/time';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { fonts } from '../../src/theme/typography';
import { BOARD_TYPES } from '../../src/theme/boardTypes';
import { mockBoards, mockShapers, mockOpinions } from '../../src/data/mock';

const FILTER_OPTIONS = ['ALL', ...BOARD_TYPES];
const SORT_OPTIONS = ['HIGHEST RATED', 'MOST OPINIONED', 'NEWEST'];

export default function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sort, setSort] = useState('HIGHEST RATED');

  const isSearching = query.length > 0;

  const boardMap = Object.fromEntries(mockBoards.map((b) => [b.id, b]));

  const filteredBoards = useMemo(() => {
    let boards = [...mockBoards];
    if (typeFilter !== 'ALL') {
      boards = boards.filter((b) => b.type === typeFilter);
    }
    if (sort === 'HIGHEST RATED') boards.sort((a, b) => b.rating - a.rating);
    else if (sort === 'MOST OPINIONED') boards.sort((a, b) => b.opinionCount - a.opinionCount);
    return boards;
  }, [typeFilter, sort]);

  const searchResults = useMemo(() => {
    if (!isSearching) return { boards: [], shapers: [] };
    const q = query.toLowerCase();
    return {
      boards: mockBoards.filter(
        (b) => b.name.toLowerCase().includes(q) || b.shaper.toLowerCase().includes(q),
      ),
      shapers: mockShapers.filter(
        (s) => s.name.toLowerCase().includes(q) || (s.location?.toLowerCase().includes(q) ?? false),
      ),
    };
  }, [query, isSearching]);

  const trendingBoards = [...mockBoards]
    .sort((a, b) => b.opinionCount - a.opinionCount)
    .slice(0, 4);

  const latestOpinions = [...mockOpinions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  if (isSearching) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.searchBarContainer}>
          <View style={[styles.searchBar, styles.searchBarFocused]}>
            <MagnifyingGlass size={16} color={colors.textLight} />
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="SEARCH BOARDS, SHAPERS..."
              placeholderTextColor={colors.textLight}
              autoFocus
            />
          </View>
          <Pressable onPress={() => setQuery('')}>
            <GText variant="label" color={colors.red}>CANCEL</GText>
          </Pressable>
        </View>

        <ScrollView style={styles.searchResults}>
          {searchResults.shapers.length > 0 && (
            <View style={styles.resultSection}>
              <GText variant="label" style={styles.sectionLabel}>SHAPERS</GText>
              {searchResults.shapers.map((shaper) => (
                <Pressable
                  key={shaper.id}
                  onPress={() => router.push(`/shaper/${shaper.id}`)}
                  style={styles.searchResultRow}
                >
                  <View style={styles.searchAvatar}>
                    <GText variant="displayS" color={colors.white}>
                      {shaper.name.charAt(0)}
                    </GText>
                  </View>
                  <View style={styles.searchResultText}>
                    <GText variant="bodyM">{shaper.name}</GText>
                    {shaper.location && <GText variant="bodyXs">{shaper.location}</GText>}
                  </View>
                  <GText variant="bodyXs">{shaper.boardCount} boards</GText>
                </Pressable>
              ))}
            </View>
          )}

          {searchResults.boards.length > 0 && (
            <View style={styles.resultSection}>
              <GText variant="label" style={styles.sectionLabel}>BOARDS</GText>
              {searchResults.boards.map((board) => (
                <Pressable
                  key={board.id}
                  onPress={() => router.push(`/board/${board.id}`)}
                  style={styles.searchResultRow}
                >
                  <View style={styles.searchThumb}>
                    <BoardTypeTag type={board.type} size="sm" />
                  </View>
                  <View style={styles.searchResultText}>
                    <GText variant="bodyM">{board.name}</GText>
                    <GText variant="bodyXs">{board.shaper}</GText>
                  </View>
                  <View style={styles.searchResultMeta}>
                    <SurfboardRating rating={board.rating} size={8} />
                    <GText variant="micro">{board.opinionCount}</GText>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {searchResults.boards.length === 0 && searchResults.shapers.length === 0 && (
            <View style={styles.noResults}>
              <GText variant="bodyM" color={colors.textMid}>Nothing found.</GText>
            </View>
          )}

          <Pressable style={styles.addBoard}>
            <GText variant="label" color={colors.red}>CAN'T FIND IT? ADD IT →</GText>
            <GText variant="bodyXs">Obscure shaper? Local legend? We want it.</GText>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const isFiltered = typeFilter !== 'ALL';

  const gridHeader = (
    <View>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <MagnifyingGlass size={16} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="SEARCH BOARDS, SHAPERS..."
            placeholderTextColor={colors.textLight}
          />
        </View>
      </View>

      <View style={styles.filterSection}>
        <Chips options={FILTER_OPTIONS} selected={typeFilter} onSelect={setTypeFilter} />
      </View>

      {!isFiltered && (
        <>
          <View style={styles.section}>
            <GText variant="label" style={styles.sectionLabel}>TRENDING</GText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingScroll}>
              {trendingBoards.map((board, i) => (
                <Pressable
                  key={board.id}
                  style={styles.trendingCard}
                  onPress={() => router.push(`/board/${board.id}`)}
                >
                  <View style={styles.trendingInner}>
                    <View style={styles.trendingBadge}>
                      <BoardTypeTag type={board.type} size="sm" />
                    </View>
                    <GText variant="displayXl" color={colors.white} style={styles.trendingRank}>
                      #{i + 1}
                    </GText>
                    <View style={styles.trendingInfo}>
                      <GText variant="displayS" color={colors.white} numberOfLines={1}>{board.name}</GText>
                      <GText variant="micro" color={colors.white}>{board.shaper.toUpperCase()}</GText>
                      <View style={styles.trendingMeta}>
                        <SurfboardRating rating={board.rating} size={8} color={colors.white} />
                        <GText variant="micro" color={colors.white}>{board.opinionCount}</GText>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <GText variant="label" style={styles.sectionLabel}>SHAPERS</GText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shaperScroll}>
              {mockShapers.map((shaper) => (
                <ShaperPill key={shaper.id} shaper={shaper} />
              ))}
            </ScrollView>
          </View>

          <GText variant="label" style={styles.sectionLabel}>ALL BOARDS</GText>
        </>
      )}

      {isFiltered && (
        <View style={styles.filteredHeader}>
          <GText variant="label" style={styles.sectionLabel}>
            {typeFilter} · {filteredBoards.length} BOARDS
          </GText>
          <Chips options={SORT_OPTIONS} selected={sort} onSelect={setSort} />
        </View>
      )}
    </View>
  );

  const gridFooter = !isFiltered ? (
    <View style={styles.latestSection}>
      <GText variant="label" style={styles.sectionLabel}>LATEST OPINIONS</GText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.latestScroll}>
        {latestOpinions.map((opinion) => {
          const board = boardMap[opinion.boardId];
          return (
            <Pressable
              key={opinion.id}
              style={styles.opinionCard}
              onPress={() => board && router.push(`/board/${board.id}`)}
            >
              <View style={styles.opinionCardTop}>
                {board && <BoardTypeTag type={board.type} size="sm" />}
                <GText variant="micro" color={colors.white}>{formatRelativeTime(opinion.createdAt)}</GText>
              </View>
              {board && (
                <GText variant="displayS" color={colors.white} numberOfLines={1}>{board.name}</GText>
              )}
              <SurfboardRating rating={opinion.rating} size={8} color={colors.white} />
              <GText variant="micro" color={colors.white}>by {opinion.username.toUpperCase()}</GText>
              {opinion.text && (
                <GText variant="bodyXs" color={colors.textMid} numberOfLines={1}>{opinion.text}</GText>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  ) : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={filteredBoards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BoardTile board={item} />}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        ListHeaderComponent={gridHeader}
        ListFooterComponent={gridFooter}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchBarFocused: {
    borderBottomWidth: 2,
    borderBottomColor: colors.red,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.text,
    padding: 0,
  },
  filterSection: {
    paddingVertical: spacing.md,
  },
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionLabel: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  trendingScroll: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  trendingCard: {
    width: 160,
    height: 200,
  },
  trendingInner: {
    flex: 1,
    backgroundColor: colors.cardDark,
    padding: spacing.md,
    justifyContent: 'flex-end',
  },
  trendingBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  trendingRank: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    opacity: 0.3,
  },
  trendingInfo: {
    gap: 2,
  },
  trendingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  shaperScroll: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  filteredHeader: {
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  gridContent: {
    gap: 2,
    paddingBottom: spacing.xl,
  },
  gridRow: {
    gap: 2,
  },
  latestSection: {
    marginTop: spacing.xl,
  },
  latestScroll: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  opinionCard: {
    width: 160,
    height: 150,
    backgroundColor: colors.cardDark,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  opinionCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchResults: {
    flex: 1,
  },
  resultSection: {
    marginBottom: spacing.lg,
  },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  searchAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchThumb: {
    width: 36,
    height: 48,
    backgroundColor: colors.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResultText: {
    flex: 1,
    gap: 2,
  },
  searchResultMeta: {
    alignItems: 'flex-end',
    gap: 2,
  },
  noResults: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  addBoard: {
    padding: spacing.xl,
    gap: spacing.xs,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    marginTop: spacing.md,
  },
});
