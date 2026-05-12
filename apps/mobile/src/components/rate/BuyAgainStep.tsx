import { View, Pressable, StyleSheet } from 'react-native';
import { GText } from '../GText';
import { BoardTypeTag } from '../BoardTypeTag';
import { SurfboardRating } from '../SurfboardRating';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { StepProps } from './types';
import type { Board } from '../../types';

interface BuyAgainStepProps extends StepProps {
  board: Board;
}

export function BuyAgainStep({ state, onUpdate, onNext, board }: BuyAgainStepProps) {
  const handleChoice = (value: boolean) => {
    onUpdate({ buyAgain: value });
    onNext();
  };

  return (
    <View style={styles.container}>
      {/* Nav */}
      <View style={styles.nav}>
        <View />
        <GText variant="micro">3 OF 3</GText>
      </View>

      {/* Title */}
      <View style={styles.header}>
        <GText variant="displayL">WOULD YOU BUY IT AGAIN?</GText>
      </View>

      {/* Summary card */}
      <View style={styles.card}>
        <BoardTypeTag type={board.type} size="md" />
        <GText variant="displayM" style={styles.boardName}>{board.name}</GText>
        <GText variant="bodyXs" style={styles.shaperName}>{board.shaper.toUpperCase()}</GText>
        <SurfboardRating rating={state.rating} size={16} />
        {state.vibeTag && (
          <View style={styles.vibeTagBadge}>
            <GText variant="micro" color={colors.textLight}>{state.vibeTag}</GText>
          </View>
        )}
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Buttons */}
      <View style={styles.buttons}>
        <Pressable style={styles.btnNo} onPress={() => handleChoice(false)}>
          <GText variant="displayS">✗ NAH</GText>
          <GText variant="bodyXs" color={colors.textMid}>FLOGGED IT TO A KOOK</GText>
        </Pressable>

        <Pressable style={styles.btnYes} onPress={() => handleChoice(true)}>
          <GText variant="displayS" color={colors.white}>↺ YEAH</GText>
          <GText variant="bodyXs" color={colors.white} style={styles.btnYesSubtext}>SHUT UP AND TAKE MY MONEY</GText>
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
  spacer: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    margin: spacing.xl,
    gap: spacing.md,
  },
  btnNo: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  btnYes: {
    flex: 1,
    backgroundColor: colors.red,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  btnYesSubtext: {
    opacity: 0.85,
  },
});
