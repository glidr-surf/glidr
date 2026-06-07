import { useState, useEffect, useMemo } from 'react';
import { View, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { MagnifyingGlass } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { GText } from '../../src/components/GText';
import { BoardThumb } from '../../src/components/BoardThumb';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { fonts } from '../../src/theme/typography';
import { TAB_BAR_CLEARANCE } from '../../src/theme/layout';
import { getBoards } from '@glidr/data';
import type { Board } from '@glidr/data';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/context/AuthContext';

function BoardRow({ board, onPress }: { board: Board; onPress: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <BoardThumb board={board} />
      <View style={styles.rowText}>
        <GText variant="bodyM">{board.name}</GText>
        <GText variant="caption" color={colors.textMid}>{board.shaper}</GText>
      </View>
      <GText variant="label" color={colors.red}>RATE →</GText>
    </Pressable>
  );
}

export default function RateScreen() {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const [query, setQuery] = useState('');
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    getBoards(supabase).then(setBoards);
  }, []);

  const filtered = useMemo(() => {
    if (!query) return boards;
    const q = query.toLowerCase();
    return boards.filter(
      (b) => b.name.toLowerCase().includes(q) || b.shaper.toLowerCase().includes(q),
    );
  }, [boards, query]);

  return (
    <Screen edges={['top']}>
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
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: TAB_BAR_CLEARANCE,
  },
  header: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.text,
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  listSeparator: {
    height: 1,
    backgroundColor: colors.borderSoft,
  },
  addBoard: {
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
});
