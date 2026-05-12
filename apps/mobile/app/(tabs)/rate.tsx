import { View, StyleSheet } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { GText } from '../../src/components/GText';
import { spacing } from '../../src/theme/spacing';

export default function RateScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <GText variant="displayL">RATE A BOARD</GText>
        <GText variant="label">RATING FLOW COMING IN PLAN 4</GText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: spacing.xl, gap: spacing.sm },
});
