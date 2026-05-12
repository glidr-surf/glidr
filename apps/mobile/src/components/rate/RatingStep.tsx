import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'phosphor-react-native';
import { GText } from '../GText';
import { SurfboardIcon } from '../SurfboardIcon';
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
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <X size={20} color={colors.text} weight="bold" />
        </Pressable>
        <GText variant="micro">1 OF 3</GText>
      </View>

      {/* Center content */}
      <View style={styles.center}>
        <GText variant="label" color={colors.textLight}>HOW'D IT GO?</GText>
        <GText variant="displayL" style={styles.boardName}>{board.name}</GText>
        <GText variant="bodyXs" style={styles.shaperName}>{board.shaper.toUpperCase()}</GText>

        {/* Scale ends */}
        <View style={styles.scaleRow}>
          <GText variant="micro">SOLD IT</GText>
          <GText variant="micro">THE MAGIC BOARD</GText>
        </View>

        {/* Surfboard icons */}
        <View style={styles.iconsRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Pressable
              key={i}
              onPress={() => onUpdate({ rating: i })}
              hitSlop={8}
              style={styles.iconButton}
            >
              <SurfboardIcon
                size={40}
                color={i <= state.rating ? colors.red : colors.border}
                filled={i <= state.rating}
              />
            </Pressable>
          ))}
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
  iconsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'center',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
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
