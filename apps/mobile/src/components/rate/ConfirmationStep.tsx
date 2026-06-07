import { View, Pressable, StyleSheet } from 'react-native';
import { HandWaving } from 'phosphor-react-native';
import { GText } from '../GText';
import { StatBlock } from '../StatBlock';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { useAuth } from '../../context/AuthContext';
import type { RateFlowState } from './types';

interface ConfirmationStepProps {
  state: RateFlowState;
  onDeepDive: () => void;
  onFinish: () => void;
  deepDiveDone?: boolean;
}

export function ConfirmationStep({ onDeepDive, onFinish, deepDiveDone = false }: ConfirmationStepProps) {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      {/* Center content */}
      <View style={styles.center}>
        <HandWaving size={56} color={colors.red} weight="fill" />
        <GText variant="displayL" style={styles.noted}>NOTED.</GText>
        <GText variant="bodyM" color={colors.textMid} style={styles.tagline}>
          One step closer to the magic board. Probably.
        </GText>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <StatBlock value={String(user?.opinionCount ?? 0)} label="BOARDS RIDDEN" />
        <StatBlock value={String(user?.magicBoardCount ?? 0)} label="MAGIC BOARDS" />
      </View>

      {/* CTAs */}
      {/* Both branches reuse testID="rate-finish" for the finish action; only one
          branch renders at a time (deepDiveDone), so the e2e selector stays unambiguous. */}
      <View style={styles.actions}>
        {deepDiveDone ? (
          <Pressable testID="rate-finish" style={styles.ctaPrimary} onPress={onFinish}>
            <GText variant="displayS" color={colors.white}>POST IT</GText>
          </Pressable>
        ) : (
          <>
            <Pressable testID="rate-deepdive" style={styles.ctaPrimary} onPress={onDeepDive}>
              <GText variant="displayS" color={colors.white}>KEEP GOING — TELL US MORE</GText>
            </Pressable>

            <Pressable testID="rate-finish" style={styles.ctaSkip} onPress={onFinish}>
              <GText variant="label" color={colors.textLight}>NAH, I'M GOOD</GText>
            </Pressable>
          </>
        )}
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
