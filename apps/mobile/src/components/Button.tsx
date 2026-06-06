import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { GText } from './GText';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', style }: ButtonProps) {
  const v = variantStyles[variant];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={8}
      style={[styles.base, v.container, style]}
    >
      <GText variant="displayS" color={v.text}>{label}</GText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: colors.text,
  },
});

const variantStyles: Record<Variant, { container: ViewStyle; text: string }> = {
  primary: { container: { backgroundColor: colors.red }, text: colors.white },
  secondary: { container: { backgroundColor: colors.surface }, text: colors.text },
  ghost: { container: { backgroundColor: 'transparent', borderColor: 'transparent' }, text: colors.red },
};
