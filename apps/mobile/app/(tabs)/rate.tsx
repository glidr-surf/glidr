import { useState, useMemo } from 'react';
import { View, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MagnifyingGlass } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { GText } from '../../src/components/GText';
import { BoardTypeTag } from '../../src/components/BoardTypeTag';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { fonts } from '../../src/theme/typography';
import { mockBoards } from '../../src/data/mock';
import type { Board } from '../../src/types';
import { useAuth } from '../../src/context/AuthContext';

function BoardRow({ board, onPress }: { board: Board; onPress: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowTag}>
        <BoardTypeTag type={board.type} size="sm" />
      </View>
      <View style={styles.rowText}>
        <GText variant="bodyM">{board.name}</GText>
        <GText variant="bodyXs" color={colors.textMid}>{board.shaper}</GText>
      </View>
      <GText variant="label" color={colors.red}>RATE →</GText>
    </Pressable>
  );
}

export default function RateScreen() {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return mockBoards;
    const q = query.toLowerCase();
    return mockBoards.filter(
      (b) => b.name.toLowerCase().includes(q) || b.shaper.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BoardRow
            board={item}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onPress={() => requireAuth(() => router.push(`/rate-flow?boardId=${item.id}` as any))}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <GText variant="displayL">RATE A BOARD</GText>
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
        }
        ListFooterComponent={
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <Pressable style={styles.addBoard} onPress={() => requireAuth(() => router.push('/add-board' as any))}>
            <GText variant="label" color={colors.red}>CAN'T FIND IT? ADD IT →</GText>
          </Pressable>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <GText variant="bodyM" color={colors.textMid}>No boards match that search.</GText>
          </View>
        }
        contentContainerStyle={styles.listContent}
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
  listContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.text,
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
    gap: spacing.md,
  },
  rowTag: {
    width: 36,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  addBoard: {
    padding: spacing.xl,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    marginTop: spacing.md,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
});
