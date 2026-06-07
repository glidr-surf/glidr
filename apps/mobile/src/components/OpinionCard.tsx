import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowFatUp, ArrowFatDown, ArrowsClockwise, X } from 'phosphor-react-native';
import { GText } from './GText';
import { Stars } from './Stars';
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
    <View testID="opinion-card" style={[styles.container, isOwn && styles.ownContainer]}>
      {showBoardInfo && board && (
        <Pressable
          onPress={() => router.push(`/board/${board.id}`)}
          style={styles.boardInfo}
        >
          <BoardTypeTag type={board.type} />
          <View style={styles.boardText}>
            <GText variant="displayS">{board.name}</GText>
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
        {(opinion.userHeight || opinion.userWeight) && (
          <GText variant="caption" color={colors.textMid}>
            Surfer · {[opinion.userHeight, opinion.userWeight].filter(Boolean).join(' · ')}
          </GText>
        )}
        {(() => {
          const dims = ['board_length', 'board_width', 'board_thickness']
            .map((k) => opinion.tags[k]?.[0])
            .filter(Boolean)
            .join(' × ');
          const rides = [dims, opinion.tags['board_volume']?.[0]].filter(Boolean).join(' · ');
          return rides ? (
            <GText variant="caption" color={colors.text} style={styles.rides}>Rides: {rides}</GText>
          ) : null;
        })()}
      </View>

      <View style={styles.ratingRow}>
        <Stars rating={opinion.scores['overall_rating'] ?? 0} size={16} />
        {opinion.tags['vibe_tag']?.[0] && (
          <View style={styles.vibeTag}>
            <GText variant="caption" color={colors.white}>
              {opinion.tags['vibe_tag'][0]}
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

      {(() => {
        const pills = [
          ...(opinion.tags['fin_setup'] ?? []),
          ...(opinion.tags['wave_size'] ?? []),
          ...(opinion.tags['quiver_role'] ?? []),
        ];
        return pills.length > 0 && (
          <View style={styles.chips}>
            {pills.map((p) => (
              <View key={p} style={styles.conditionChip}>
                <GText variant="caption">{p}</GText>
              </View>
            ))}
          </View>
        );
      })()}

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
        <View style={styles.buyAgain}>
          {opinion.scores['buy_again'] ? (
            <ArrowsClockwise size={13} color={colors.green} weight="bold" />
          ) : (
            <X size={13} color={colors.red} weight="bold" />
          )}
          <GText variant="caption" color={opinion.scores['buy_again'] ? colors.green : colors.red}>
            {opinion.scores['buy_again'] ? 'WOULD BUY AGAIN' : "WON'T BUY AGAIN"}
          </GText>
        </View>

        <View style={styles.votes}>
          <Pressable onPress={onUpvote} style={styles.voteButton}>
            <ArrowFatUp size={14} color={colors.textLight} weight="regular" />
          </Pressable>
          <GText variant="caption">{opinion.upvotes - opinion.downvotes}</GText>
          <Pressable onPress={onDownvote} style={styles.voteButton}>
            <ArrowFatDown size={14} color={colors.textLight} weight="regular" />
          </Pressable>
        </View>

        <GText variant="caption">{formatRelativeTime(opinion.createdAt)}</GText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1.5,
    borderColor: colors.borderSoft,
    borderRadius: 4,
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
  rides: {
    marginTop: 1,
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
  buyAgain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
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
