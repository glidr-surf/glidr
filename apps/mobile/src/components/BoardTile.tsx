import { View, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { GText } from './GText';
import { BoardTypeTag } from './BoardTypeTag';
import { Stars } from './Stars';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import type { Board } from '../types';

interface BoardTileProps {
  board: Board;
}

export function BoardTile({ board }: BoardTileProps) {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push(`/board/${board.id}`)} style={styles.wrap}>
      <View style={styles.shadow} />
      <View style={styles.frame}>
        <View style={styles.imageWrap}>
          {board.imageUrl ? (
            <Image testID="board-image" source={{ uri: board.imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.fallback}>
              <GText variant="displayL" color={colors.surface}>{board.name.charAt(0)}</GText>
            </View>
          )}
          <View style={styles.tag}>
            <BoardTypeTag type={board.type} size="sm" />
          </View>
        </View>
        <View style={styles.caption}>
          <GText variant="displayS" color={colors.surface} numberOfLines={1}>{board.name}</GText>
          <GText variant="caption" color={colors.yellow}>{board.shaper.toUpperCase()}</GText>
          <View style={styles.stars}>
            <Stars rating={board.rating} size={14} color={colors.yellow} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, position: 'relative' },
  shadow: { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, backgroundColor: colors.text },
  frame: { borderWidth: 2.5, borderColor: colors.text, backgroundColor: colors.cardDark },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 128, resizeMode: 'cover' },
  fallback: { width: '100%', height: 128, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blue },
  tag: { position: 'absolute', top: 7, left: 7 },
  caption: { padding: spacing.sm },
  stars: { marginTop: 4 },
});
