import { View, StyleSheet } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { GText } from '../../src/components/GText';
import { spacing } from '../../src/theme/spacing';

export default function SearchScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <GText variant="displayL">DISCOVER</GText>
        <GText variant="label">SEARCH COMING IN PLAN 2</GText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: spacing.xl, gap: spacing.sm },
});
