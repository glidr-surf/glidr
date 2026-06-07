import { View, Pressable, StyleSheet } from 'react-native';
import { Star } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

interface StarRatingProps {
  value: number; // 0..5
  onChange: (v: number) => void;
  size?: number;
  color?: string;
}

export function StarRating({ value, onChange, size = 44, color = colors.yellow }: StarRatingProps) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Pressable
          key={i}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Rate ${i} of 5`}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onChange(i); }}
          style={({ pressed }) => (pressed ? styles.pressed : undefined)}
        >
          <Star size={size} color={color} weight={i <= value ? 'fill' : 'regular'} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  pressed: { transform: [{ scale: 0.9 }] },
});
