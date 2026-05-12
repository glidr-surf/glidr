import { View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { GText } from '../../src/components/GText';
import { spacing } from '../../src/theme/spacing';
import { mockShapers } from '../../src/data/mock';

export default function ShaperScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const shaper = mockShapers.find((s) => s.id === id) ?? mockShapers[0];

  return (
    <Screen scrollable>
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()}>
          <GText variant="label">← BACK</GText>
        </Pressable>
      </View>
      <View style={styles.header}>
        <GText variant="displayL">{shaper.name.toUpperCase()}</GText>
        {shaper.location && <GText variant="label">{shaper.location.toUpperCase()}</GText>}
        <GText variant="label">SHAPER PAGE COMING IN PLAN 2</GText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  nav: { padding: spacing.xl, paddingBottom: 0 },
  header: { padding: spacing.xl, gap: spacing.sm },
});
