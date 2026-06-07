import { View, Pressable, StyleSheet } from 'react-native';
import { CaretLeft } from 'phosphor-react-native';
import { GText } from '../GText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

/** Shared rate-flow nav row: optional back button (left) + step label (right). */
export function StepNav({ onBack, label }: { onBack?: () => void; label?: string }) {
  return (
    <View style={styles.nav}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={8} accessibilityRole="button" accessibilityLabel="Back">
          <CaretLeft size={22} color={colors.text} weight="bold" />
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
      {label ? <GText variant="caption">{label}</GText> : <View />}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  spacer: { width: 22 },
});
