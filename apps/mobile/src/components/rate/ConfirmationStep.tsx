import { View, Pressable, StyleSheet } from 'react-native';
import { GText } from '../GText';
import { StatBlock } from '../StatBlock';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { mockCurrentUser } from '../../data/mock';
import type { RateFlowState } from './types';

interface ConfirmationStepProps {
  state: RateFlowState;
  onDeepDive: () => void;
  onFinish: () => void;
}

export function ConfirmationStep({ onDeepDive, onFinish }: ConfirmationStepProps) {
  return (
    <View style={styles.container}>
      {/* Center content */}
      <View style={styles.center}>
        <GText variant="displayXl">🤙</GText>
        <GText variant="displayL" style={styles.noted}>NOTED.</GText>
        <GText variant="bodyM" color={colors.textMid} style={styles.tagline}>
          One step closer to the magic board. Probably.
        </GText>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <StatBlock value={String(mockCurrentUser.boardCount)} label="BOARDS RIDDEN" />
        <StatBlock value={String(mockCurrentUser.magicBoardCount)} label="MAGIC BOARDS" />
      </View>

      {/* CTAs */}
      <View style={styles.actions}>
        <Pressable style={styles.ctaPrimary} onPress={onDeepDive}>
          <GText variant="displayS" color={colors.white}>KEEP GOING — TELL US MORE</GText>
        </Pressable>

        <Pressable style={styles.ctaSkip} onPress={onFinish}>
          <GText variant="label" color={colors.textLight}>NAH, I'M GOOD</GText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: spacing.xl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  noted: {
    textAlign: 'center',
  },
  tagline: {
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actions: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  ctaPrimary: {
    backgroundColor: colors.red,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  ctaSkip: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
});
