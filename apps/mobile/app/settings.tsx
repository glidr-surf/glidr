import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { GText } from '../src/components/GText';
import { spacing } from '../src/theme/spacing';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <Screen scrollable>
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()}>
          <GText variant="label">← BACK</GText>
        </Pressable>
      </View>
      <View style={styles.header}>
        <GText variant="displayL">SETTINGS</GText>
        <GText variant="label">SETTINGS COMING IN PLAN 3</GText>
      </View>
      <View style={styles.footer}>
        <GText variant="micro">GLIDR V0.1.0 — STILL IN BETA. LIKE YOUR SURFING.</GText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  nav: { padding: spacing.xl, paddingBottom: 0 },
  header: { padding: spacing.xl, gap: spacing.sm },
  footer: { padding: spacing.xl, marginTop: 'auto' },
});
