import { View, StyleSheet } from 'react-native';
import { Star, StarHalf } from 'phosphor-react-native';
import { colors } from '../theme/colors';

export type StarState = 'full' | 'half' | 'empty';

export function starStates(rating: number): StarState[] {
  return [1, 2, 3, 4, 5].map((i) => {
    if (rating >= i) return 'full';
    if (rating >= i - 0.5) return 'half';
    return 'empty';
  });
}

interface StarsProps {
  rating: number;
  size?: number;
  color?: string;
}

export function Stars({ rating, size = 14, color = colors.text }: StarsProps) {
  return (
    <View style={styles.row}>
      {starStates(rating).map((state, idx) => {
        if (state === 'half') {
          return <StarHalf key={idx} size={size} color={color} weight="fill" />;
        }
        return (
          <Star
            key={idx}
            size={size}
            color={color}
            weight={state === 'full' ? 'fill' : 'regular'}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
