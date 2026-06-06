import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { GText } from './GText';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import type { Shaper } from '../types';

interface ShaperPillProps {
  shaper: Shaper;
}

export function ShaperPill({ shaper }: ShaperPillProps) {
  const router = useRouter();
  const initial = shaper.name.charAt(0).toUpperCase();

  return (
    <Pressable
      onPress={() => router.push(`/shaper/${shaper.id}`)}
      style={styles.container}
    >
      <View style={styles.avatar}>
        <GText variant="displayS" color={colors.white}>{initial}</GText>
      </View>
      <GText variant="bodyM" numberOfLines={1}>{shaper.name}</GText>
      <GText variant="caption">{shaper.boardCount} BOARDS</GText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xs,
    width: 80,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
