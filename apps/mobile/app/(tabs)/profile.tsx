import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { GText } from '../../src/components/GText';
import { spacing } from '../../src/theme/spacing';
import { colors } from '../../src/theme/colors';
import { mockCurrentUser } from '../../src/data/mock';

export default function ProfileScreen() {
  const router = useRouter();
  return (
    <Screen>
      <View style={styles.header}>
        <GText variant="displayL">{mockCurrentUser.username.toUpperCase()}</GText>
        <GText variant="label">PROFILE COMING IN PLAN 3</GText>
      </View>
      <View style={styles.links}>
        <Pressable onPress={() => router.push('/badges')} style={styles.link}>
          <GText variant="bodyM" color={colors.red}>Badges →</GText>
        </Pressable>
        <Pressable onPress={() => router.push('/settings')} style={styles.link}>
          <GText variant="bodyM" color={colors.red}>Settings →</GText>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: spacing.xl, gap: spacing.sm },
  links: { padding: spacing.xl, gap: spacing.md },
  link: { paddingVertical: spacing.sm },
});
