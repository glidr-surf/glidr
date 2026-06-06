import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { GText } from './GText';
import { SurfboardRating } from './SurfboardRating';
import { BoardTypeTag } from './BoardTypeTag';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { formatRelativeTime } from '../utils/time';
import type { Opinion, Board } from '../types';

interface CompactOpinionCardProps {
  opinion: Opinion;
  board?: Board;
}

export function CompactOpinionCard({ opinion, board }: CompactOpinionCardProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => board && router.push(`/board/${board.id}`)}
      style={styles.container}
    >
      <View style={styles.top}>
        {board && (
          <View style={styles.boardInfo}>
            <BoardTypeTag type={board.type} />
            <GText variant="bodyM" numberOfLines={1} style={styles.boardName}>
              {board.name}
            </GText>
            {opinion.tags['board_length']?.[0] && (
              <GText variant="caption">{opinion.tags['board_length'][0]}</GText>
            )}
          </View>
        )}
        <GText variant="caption">{formatRelativeTime(opinion.createdAt)}</GText>
      </View>

      <View style={styles.ratingRow}>
        <SurfboardRating rating={opinion.scores['overall_rating'] ?? 0} size={10} />
        <GText variant="caption" color={colors.textMid}>
          by {opinion.username}
        </GText>
      </View>

      {opinion.text && (
        <GText variant="bodyM" numberOfLines={1} color={colors.textMid}>
          {opinion.text}
        </GText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    gap: spacing.xs,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  boardName: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
