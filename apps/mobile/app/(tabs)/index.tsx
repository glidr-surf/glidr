import { useState, useEffect, useMemo } from 'react';
import { View, Image, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MagnifyingGlass } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { GText } from '../../src/components/GText';
import { BoardTile } from '../../src/components/BoardTile';
import { BoardTypeTag } from '../../src/components/BoardTypeTag';
import { Stars } from '../../src/components/Stars';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { getBoards } from '@glidr/data';
import type { Board } from '@glidr/data';
import { supabase } from '../../src/lib/supabase';

export default function HomeScreen() {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    getBoards(supabase).then(setBoards);
  }, []);

  const ranked = useMemo(() => [...boards].sort((a, b) => b.rating - a.rating), [boards]);
  const featured = ranked[0];
  const lineup = ranked.slice(1);

  const header = (
    <View>
      <View style={styles.headerBar}>
        <GText variant="displayL" color={colors.surface} style={styles.logo}>GLIDR</GText>
        <View style={styles.headerRight}>
          <Pressable onPress={() => router.push('/search')} hitSlop={10}>
            <MagnifyingGlass size={24} color={colors.surface} weight="bold" />
          </Pressable>
          <View style={styles.dot} />
        </View>
      </View>

      <View style={styles.body}>
        {featured && (
          <Pressable style={styles.posterWrap} onPress={() => router.push(`/board/${featured.id}`)}>
            <View style={styles.posterShadow} />
            <View style={styles.poster}>
              {featured.imageUrl ? (
                <Image source={{ uri: featured.imageUrl }} style={styles.posterImg} />
              ) : (
                <View style={[styles.posterImg, styles.posterFallback]}>
                  <GText variant="displayXl" color={colors.surface}>{featured.name.charAt(0)}</GText>
                </View>
              )}
              <View style={styles.posterTag}><BoardTypeTag type={featured.type} size="sm" /></View>
              <GText variant="displayXl" color={colors.yellow} style={styles.rank}>#1</GText>
              <View style={styles.posterCap}>
                <GText variant="displayM" color={colors.surface} numberOfLines={1}>{featured.name}</GText>
                <View style={styles.posterMeta}>
                  <Stars rating={featured.rating} size={16} color={colors.yellow} />
                  <GText variant="caption" color={colors.yellow}>
                    {featured.shaper.toUpperCase()} · {featured.opinionCount} OPINIONS
                  </GText>
                </View>
              </View>
            </View>
          </Pressable>
        )}
        <GText variant="label" style={styles.lineupLabel}>THE LINEUP</GText>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={lineup}
        keyExtractor={(b) => b.id}
        numColumns={2}
        renderItem={({ item }) => <BoardTile board={item} />}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        ListHeaderComponent={header}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  headerBar: { backgroundColor: colors.red, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  logo: { letterSpacing: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dot: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.yellow, borderWidth: 2, borderColor: colors.text },
  body: { padding: spacing.lg },
  posterWrap: { position: 'relative', marginBottom: spacing.xl },
  posterShadow: { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, backgroundColor: colors.text },
  poster: { borderWidth: 2.5, borderColor: colors.text, backgroundColor: colors.cardDark },
  posterImg: { width: '100%', height: 215, resizeMode: 'cover' },
  posterFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blue },
  posterTag: { position: 'absolute', top: 10, left: 10 },
  rank: { position: 'absolute', top: 4, right: 12 },
  posterCap: { backgroundColor: colors.cardDark, padding: spacing.md },
  posterMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 6 },
  lineupLabel: { marginBottom: spacing.md },
  grid: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  gridRow: { gap: spacing.lg, marginBottom: spacing.lg },
});
