import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { GText } from './GText';
import { BoardTypeTag } from './BoardTypeTag';
import { Stars } from './Stars';
import { BoldBlock } from './BoldBlock';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import type { Board } from '../types';

interface BoardTileProps {
  board: Board;
}

export function BoardTile({ board }: BoardTileProps) {
  const router = useRouter();

  return (
    <Pressable
      testID={`board-tile-${board.id}`}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/board/${board.id}`);
      }}
    >
      <BoldBlock tone="ink">
        <View style={styles.imageWrap}>
          {board.imageUrl ? (
            <Image
              testID="board-image"
              source={{ uri: board.imageUrl }}
              style={styles.image}
              contentFit="cover"
              contentPosition="top"
              transition={200}
            />
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
      </BoldBlock>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 128 },
  fallback: { width: '100%', height: 128, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blue },
  tag: { position: 'absolute', top: 7, left: 7 },
  caption: { padding: spacing.sm },
  stars: { marginTop: 4 },
});
