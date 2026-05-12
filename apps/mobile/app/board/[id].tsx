import { View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { GText } from '../../src/components/GText';
import { SurfboardRating } from '../../src/components/SurfboardRating';
import { spacing } from '../../src/theme/spacing';
import { colors } from '../../src/theme/colors';
import { mockBoards } from '../../src/data/mock';

export default function BoardProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const board = mockBoards.find((b) => b.id === id) ?? mockBoards[0];

  return (
    <Screen scrollable>
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()}>
          <GText variant="label">← BACK</GText>
        </Pressable>
      </View>
      <View style={styles.header}>
        <GText variant="displayL">{board.name}</GText>
        <Pressable onPress={() => router.push(`/shaper/${board.shaperId}`)}>
          <GText variant="label" color={colors.red}>{board.shaper.toUpperCase()}</GText>
        </Pressable>
        <SurfboardRating rating={board.rating} size={20} />
        <GText variant="label">BOARD PROFILE COMING IN PLAN 2</GText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  nav: { padding: spacing.xl, paddingBottom: 0 },
  header: { padding: spacing.xl, gap: spacing.sm },
});
