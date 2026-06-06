import { View, StyleSheet, ViewProps } from 'react-native';
import { colors } from '../theme/colors';

type Tone = 'ink' | 'red' | 'yellow' | 'blue';

interface BoldBlockProps extends ViewProps {
  tone?: Tone;
}

const toneBg: Record<Tone, string> = {
  ink: colors.cardDark,
  red: colors.red,
  yellow: colors.yellow,
  blue: colors.blue,
};

export function BoldBlock({ tone = 'ink', style, children, testID, ...props }: BoldBlockProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.shadow} />
      <View
        testID={testID ? `${testID}-content` : undefined}
        style={[styles.content, { backgroundColor: toneBg[tone] }, style]}
        {...props}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  shadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: colors.text,
  },
  content: {
    borderWidth: 2.5,
    borderColor: colors.text,
  },
});
