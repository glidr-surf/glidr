import { useState, useEffect, useMemo } from 'react';
import { View, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MagnifyingGlass } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { GText } from '../src/components/GText';
import { Chips } from '../src/components/Chips';
import { BoardTypeTag } from '../src/components/BoardTypeTag';
import { Stars } from '../src/components/Stars';
import { filterSearch } from '../src/utils/searchFilter';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { fonts } from '../src/theme/typography';
import { BOARD_TYPES } from '../src/theme/boardTypes';
import { getBoards, getShapers } from '@glidr/data';
import type { Board, Shaper } from '@glidr/data';
import { supabase } from '../src/lib/supabase';

const FILTER_OPTIONS = ['ALL', ...BOARD_TYPES];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [boards, setBoards] = useState<Board[]>([]);
  const [shapers, setShapers] = useState<Shaper[]>([]);

  useEffect(() => {
    getBoards(supabase).then(setBoards);
    getShapers(supabase).then(setShapers);
  }, []);

  const typed = typeFilter === 'ALL' ? boards : boards.filter((b) => b.type === typeFilter);
  const results = useMemo(() => filterSearch(typed, shapers, query), [typed, shapers, query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.bar}>
        <View style={styles.input}>
          <MagnifyingGlass size={18} color={colors.textLight} weight="bold" />
          <TextInput
            style={styles.field}
            value={query}
            onChangeText={setQuery}
            placeholder="SEARCH BOARDS, SHAPERS..."
            placeholderTextColor={colors.textLight}
            autoFocus
          />
        </View>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <GText variant="label" color={colors.red}>CANCEL</GText>
        </Pressable>
      </View>

      <View style={styles.filters}>
        <Chips options={FILTER_OPTIONS} selected={typeFilter} onSelect={setTypeFilter} />
      </View>

      <ScrollView contentContainerStyle={styles.results}>
        {results.shapers.map((s) => (
          <Pressable key={s.id} style={styles.row} onPress={() => router.push(`/shaper/${s.id}`)}>
            <GText variant="bodyM">{s.name}</GText>
            {s.location && <GText variant="caption">{s.location}</GText>}
          </Pressable>
        ))}
        {results.boards.map((b) => (
          <Pressable key={b.id} style={styles.row} onPress={() => router.push(`/board/${b.id}`)}>
            <BoardTypeTag type={b.type} size="sm" />
            <View style={styles.rowText}>
              <GText variant="bodyM">{b.name}</GText>
              <GText variant="caption">{b.shaper}</GText>
            </View>
            <Stars rating={b.rating} size={14} />
          </Pressable>
        ))}
        {query.length > 0 && results.boards.length === 0 && results.shapers.length === 0 && (
          <View style={styles.empty}><GText variant="bodyM" color={colors.textMid}>Nothing found.</GText></View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  bar: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  input: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.borderSoft, borderRadius: 10, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  field: { flex: 1, fontFamily: fonts.bodySemiBold, fontSize: 13, letterSpacing: 1, color: colors.text, padding: 0 },
  filters: { paddingVertical: spacing.md },
  results: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  rowText: { flex: 1, gap: 2 },
  empty: { padding: spacing.xl, alignItems: 'center' },
});
