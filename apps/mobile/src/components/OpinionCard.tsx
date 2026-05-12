import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowFatUp, ArrowFatDown } from 'phosphor-react-native';
import { GText } from './GText';
import { SurfboardRating } from './SurfboardRating';
import { BoardTypeTag } from './BoardTypeTag';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { formatRelativeTime } from '../utils/time';
import type { Opinion, Board } from '../types';

interface OpinionCardProps {
  opinion: Opinion;
  board?: Board;
  showBoardInfo?: boolean;
  isOwn?: boolean;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function OpinionCard({
  opinion,
  board,
  showBoardInfo = false,
  isOwn = false,
  onUpvote,
  onDownvote,
  onEdit,
  onDelete,
}: OpinionCardProps) {
  const router = useRouter();

  return (
    <View style={[styles.container, isOwn && styles.ownContainer]}>
      {showBoardInfo && board && (
        <Pressable
          onPress={() => router.push(`/board/${board.id}`)}
          style={styles.boardInfo}
        >
          <BoardTypeTag type={board.type} />
          <View style={styles.boardText}>
            <GText variant="displayS">
              {board.name}
              {opinion.boardLength ? ` ${opinion.boardLength}` : ''}
            </GText>
            <Pressable onPress={() => router.push(`/shaper/${board.shaperId}`)}>
              <GText variant="label" color={colors.red}>
                {board.shaper.toUpperCase()}
              </GText>
            </Pressable>
          </View>
        </Pressable>
      )}

      <View style={styles.header}>
        <Pressable onPress={() => router.push(`/user/${opinion.userId}`)}>
          <GText variant="bodyM" color={colors.text}>
            {opinion.username}
          </GText>
        </Pressable>
        {(opinion.userHeight || opinion.userWeight || opinion.boardLength) && (
          <GText variant="bodyXs">
            {[opinion.boardLength, opinion.userHeight, opinion.userWeight].filter(Boolean).join(' · ')}
          </GText>
        )}
      </View>

      <View style={styles.ratingRow}>
        <SurfboardRating rating={opinion.rating} size={14} />
        {opinion.vibeTag && (
          <View style={styles.vibeTag}>
            <GText variant="micro" color={colors.white}>
              {opinion.vibeTag}
            </GText>
          </View>
        )}
      </View>

      {opinion.text && (
        <GText
          variant="bodyM"
          numberOfLines={showBoardInfo ? 2 : undefined}
          style={styles.opinionText}
        >
          {opinion.text}
        </GText>
      )}

      {opinion.waveSizes && opinion.waveSizes.length > 0 && (
        <View style={styles.chips}>
          {opinion.waveSizes.map((size) => (
            <View key={size} style={styles.conditionChip}>
              <GText variant="micro">{size}</GText>
            </View>
          ))}
        </View>
      )}

      {isOwn && (onEdit || onDelete) && (
        <View style={styles.ownActions}>
          {onEdit && (
            <Pressable onPress={onEdit} style={styles.ownActionButton}>
              <GText variant="label" color={colors.red}>EDIT</GText>
            </Pressable>
          )}
          {onDelete && (
            <Pressable onPress={onDelete} style={styles.ownActionButton}>
              <GText variant="label" color={colors.textMid}>DELETE</GText>
            </Pressable>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <GText variant="bodyS" color={opinion.buyAgain ? colors.green : colors.red}>
          {opinion.buyAgain ? '↺ YES' : '✗ NO'}
        </GText>

        <View style={styles.votes}>
          <Pressable onPress={onUpvote} style={styles.voteButton}>
            <ArrowFatUp size={14} color={colors.textLight} weight="regular" />
          </Pressable>
          <GText variant="bodyXs">{opinion.upvotes - opinion.downvotes}</GText>
          <Pressable onPress={onDownvote} style={styles.voteButton}>
            <ArrowFatDown size={14} color={colors.textLight} weight="regular" />
          </Pressable>
        </View>

        <GText variant="bodyXs">{formatRelativeTime(opinion.createdAt)}</GText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  ownContainer: {
    borderColor: colors.red,
  },
  boardInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  boardText: {
    flex: 1,
    gap: 2,
  },
  header: {
    gap: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  vibeTag: {
    backgroundColor: colors.red,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  opinionText: {
    lineHeight: 20,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  conditionChip: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  votes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  voteButton: {
    padding: 4,
  },
  ownActions: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  ownActionButton: {
    paddingVertical: spacing.xs,
  },
});
