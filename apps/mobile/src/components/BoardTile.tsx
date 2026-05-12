import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { GText } from './GText';
import { BoardTypeTag } from './BoardTypeTag';
import { SurfboardRating } from './SurfboardRating';
import { colors } from '../theme/colors';
import type { Board } from '../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GAP = 2;
const TILE_WIDTH = (SCREEN_WIDTH - GAP * 2) / 3;
const TILE_HEIGHT = TILE_WIDTH / 0.65;

interface BoardTileProps {
  board: Board;
}

export function BoardTile({ board }: BoardTileProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/board/${board.id}`)}
      style={styles.container}
    >
      <View style={styles.inner}>
        <View style={styles.tagPosition}>
          <BoardTypeTag type={board.type} size="sm" />
        </View>

        <View style={styles.gradient}>
          <GText variant="displayS" color={colors.white} numberOfLines={1}>
            {board.name}
          </GText>
          <GText variant="micro" color={colors.white} style={styles.shaperText}>
            {board.shaper.toUpperCase()}
          </GText>
          <View style={styles.statsRow}>
            <SurfboardRating rating={board.rating} size={8} color={colors.white} />
            <GText variant="micro" color={colors.white}>
              {board.opinionCount}
            </GText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
  },
  inner: {
    flex: 1,
    backgroundColor: colors.cardDark,
    justifyContent: 'flex-end',
  },
  tagPosition: {
    position: 'absolute',
    top: 6,
    left: 6,
    zIndex: 1,
  },
  gradient: {
    padding: 6,
    paddingTop: 20,
    backgroundColor: 'rgba(42,39,32,0.92)',
  },
  shaperText: {
    marginTop: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
});
