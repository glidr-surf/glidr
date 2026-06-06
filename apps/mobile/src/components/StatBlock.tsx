import { View, StyleSheet } from 'react-native';
import { GText } from './GText';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface StatBlockProps {
  value: string;
  label: string;
}

export function StatBlock({ value, label }: StatBlockProps) {
  return (
    <View style={styles.container}>
      <GText variant="displayM">{value}</GText>
      <GText variant="caption">{label}</GText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
});
