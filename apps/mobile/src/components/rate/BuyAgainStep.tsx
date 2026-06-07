import { View, Pressable, StyleSheet } from 'react-native';
import { X, ArrowsClockwise } from 'phosphor-react-native';
import { GText } from '../GText';
import { StepNav } from './StepNav';
import { BoardTypeTag } from '../BoardTypeTag';
import { Stars } from '../Stars';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { StepProps } from './types';
import type { Board } from '../../types';

interface BuyAgainStepProps extends StepProps {
  board: Board;
}

export function BuyAgainStep({ state, onUpdate, onNext, onBack, board }: BuyAgainStepProps) {
  const handleChoice = (value: boolean) => {
    onUpdate({ buyAgain: value });
    onNext();
  };

  return (
    <View style={styles.container}>
      {/* Nav */}
      <StepNav onBack={onBack} label="3 OF 3" />

      {/* Title */}
      <View style={styles.header}>
        <GText variant="displayL">WOULD YOU BUY IT AGAIN?</GText>
      </View>

      {/* Summary card */}
      <View style={styles.card}>
        <BoardTypeTag type={board.type} size="md" />
        <GText variant="displayM" style={styles.boardName}>{board.name}</GText>
        <GText variant="caption" style={styles.shaperName}>{board.shaper.toUpperCase()}</GText>
        <Stars rating={state.rating} size={16} />
        {state.vibeTag && (
          <View style={styles.vibeTagBadge}>
            <GText variant="caption" color={colors.textLight}>{state.vibeTag}</GText>
          </View>
        )}
      </View>

      {/* Buttons — stacked, filling the space below the card */}
      <View style={styles.fill}>
        <Pressable testID="buyagain-yes" style={styles.btnYes} onPress={() => handleChoice(true)}>
          <View style={styles.btnLabel}><ArrowsClockwise size={22} color={colors.white} weight="bold" /><GText variant="displayS" color={colors.white}>YEAH</GText></View>
          <GText variant="caption" color={colors.white} style={styles.btnYesSubtext}>SHUT UP AND TAKE MY MONEY</GText>
        </Pressable>

        <Pressable style={styles.btnNo} onPress={() => handleChoice(false)}>
          <View style={styles.btnLabel}><X size={22} color={colors.text} weight="bold" /><GText variant="displayS">NAH</GText></View>
          <GText variant="caption" color={colors.textMid}>FLOGGED IT TO A KOOK</GText>
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
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  header: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  card: {
    marginHorizontal: spacing.xl,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
  },
  boardName: {
    marginTop: spacing.xs,
  },
  shaperName: {
    letterSpacing: 1,
  },
  vibeTagBadge: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  fill: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  btnLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  btnNo: {
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  btnYes: {
    backgroundColor: colors.red,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  btnYesSubtext: {
    opacity: 0.85,
  },
});
