import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { GText } from '../src/components/GText';
import { spacing } from '../src/theme/spacing';
import { mockBadges } from '../src/data/mock';

export default function BadgesScreen() {
  const router = useRouter();
  const earned = mockBadges.filter((b) => b.earned).length;

  return (
    <Screen scrollable>
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()}>
          <GText variant="label">← BACK</GText>
        </Pressable>
        <GText variant="label">{earned} OF {mockBadges.length}</GText>
      </View>
      <View style={styles.header}>
        <GText variant="displayL">BADGES</GText>
        <GText variant="bodyS">Proof you actually surf. Probably.</GText>
        <GText variant="label">BADGES PAGE COMING IN PLAN 3</GText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  nav: { padding: spacing.xl, paddingBottom: 0, flexDirection: 'row', justifyContent: 'space-between' },
  header: { padding: spacing.xl, gap: spacing.sm },
});
