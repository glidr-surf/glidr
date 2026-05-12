import { useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GText } from '../../src/components/GText';
import { Chips } from '../../src/components/Chips';
import { OpinionCard } from '../../src/components/OpinionCard';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { BOARD_TYPES } from '../../src/theme/boardTypes';
import { mockOpinions, mockBoards } from '../../src/data/mock';

const FILTER_OPTIONS = ['ALL', ...BOARD_TYPES];

export default function HomeScreen() {
  const [filter, setFilter] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const boardMap = Object.fromEntries(mockBoards.map((b) => [b.id, b]));

  const sortedOpinions = [...mockOpinions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const filteredOpinions = filter === 'ALL'
    ? sortedOpinions
    : sortedOpinions.filter((o) => boardMap[o.boardId]?.type === filter);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={filteredOpinions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OpinionCard
            opinion={item}
            board={boardMap[item.boardId]}
            showBoardInfo
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.red}
          />
        }
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <GText variant="displayL">LATEST</GText>
            <Chips
              options={FILTER_OPTIONS}
              selected={filter}
              onSelect={setFilter}
            />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <GText variant="bodyM" color={colors.textMid}>
              No opinions yet. Someone has to go first.
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
  headerSection: {
    gap: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  separator: {
    height: spacing.md,
  },
  empty: {
    paddingVertical: spacing['3xl'],
    alignItems: 'center',
  },
});
