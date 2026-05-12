import { View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { GText } from '../../src/components/GText';
import { spacing } from '../../src/theme/spacing';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <Screen scrollable>
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()}>
          <GText variant="label">← BACK</GText>
        </Pressable>
      </View>
      <View style={styles.header}>
        <GText variant="displayL">USER {id?.toString().toUpperCase()}</GText>
        <GText variant="label">USER PROFILE COMING IN PLAN 3</GText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  nav: { padding: spacing.xl, paddingBottom: 0 },
  header: { padding: spacing.xl, gap: spacing.sm },
});
