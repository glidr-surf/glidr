import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { GText } from '../GText';
import { StarRating } from '../StarRating';
import { navBack } from '../../utils/navBack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { StepProps } from './types';
import type { Board } from '../../types';

const QUIPS: Record<number, string> = {
  1: 'Binned it.',
  2: 'Meh.',
  3: 'Does the job.',
  4: 'Proper good. Would tell your mates.',
  5: 'The magic board.',
};

interface RatingStepProps extends StepProps {
  board: Board;
}

export function RatingStep({ state, onUpdate, onNext, board }: RatingStepProps) {
  const router = useRouter();
  const quip = state.rating > 0 ? QUIPS[state.rating] : '';

  return (
    <View style={styles.container}>
      {/* Nav */}
      <View style={styles.nav}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); navBack(router); }} hitSlop={8} accessibilityRole="button" accessibilityLabel="Close">
          <X size={20} color={colors.text} weight="bold" />
        </Pressable>
        <GText variant="caption">1 OF 3</GText>
      </View>

      {/* Center content */}
      <View style={styles.center}>
        <GText variant="label" color={colors.textLight}>HOW'D IT GO?</GText>
        <GText variant="displayL" style={styles.boardName}>{board.name}</GText>
        <GText variant="caption" style={styles.shaperName}>{board.shaper.toUpperCase()}</GText>

        {/* Scale ends */}
        <View style={styles.scaleRow}>
          <GText variant="caption">SOLD IT</GText>
          <GText variant="caption">THE MAGIC BOARD</GText>
        </View>

        {/* Star rating */}
        <View style={styles.starsRow}>
          <StarRating value={state.rating} onChange={(i) => onUpdate({ rating: i })} color={colors.red} />
        </View>

        {/* Quip */}
        <View style={styles.quipRow}>
          {quip ? (
            <GText variant="bodyM" color={colors.textMid} style={styles.quip}>{quip}</GText>
          ) : (
            <GText variant="bodyM" color={colors.textLight} style={styles.quip}> </GText>
          )}
        </View>
      </View>

      {/* CTA */}
      <Pressable
        style={[styles.cta, state.rating === 0 && styles.ctaDisabled]}
        onPress={onNext}
        disabled={state.rating === 0}
      >
        <GText variant="displayS" color={colors.white}>NEXT</GText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: spacing.xl,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  boardName: {
    textAlign: 'center',
  },
  shaperName: {
    textAlign: 'center',
    letterSpacing: 1,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.lg,
  },
  starsRow: {
    alignItems: 'center',
  },
  quipRow: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  quip: {
    textAlign: 'center',
  },
  cta: {
    margin: spacing.xl,
    backgroundColor: colors.red,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.3,
  },
});
