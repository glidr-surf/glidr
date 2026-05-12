import { View, StyleSheet } from 'react-native';
import { SurfboardIcon } from './SurfboardIcon';
import { colors } from '../theme/colors';

interface SurfboardRatingProps {
  rating: number;
  size?: number;
  color?: string;
}

export function SurfboardRating({ rating, size = 16, color = colors.text }: SurfboardRatingProps) {
  const filled = Math.round(rating);

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((i) => (
        <SurfboardIcon
          key={i}
          size={size}
          color={color}
          filled={i <= filled}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
