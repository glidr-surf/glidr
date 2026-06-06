import { View, Pressable, StyleSheet } from 'react-native';
import { GText } from '../GText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface DiscreteSliderProps {
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
  lowEnd: string;
  highEnd: string;
}

export function DiscreteSlider({ label, value, onChange, lowEnd, highEnd }: DiscreteSliderProps) {
  return (
    <View style={styles.container}>
      {/* Top row: label + value */}
      <View style={styles.topRow}>
        <GText variant="label">{label}</GText>
        <GText variant="label" style={styles.valueText}>
          {value != null ? `${value}/10` : '—/10'}
        </GText>
      </View>

      {/* Segments */}
      <View style={styles.segments}>
        {Array.from({ length: 10 }, (_, i) => {
          const segValue = i + 1;
          const filled = value != null && segValue <= value;
          return (
            <Pressable
              key={segValue}
              style={[styles.segment, filled ? styles.segmentFilled : styles.segmentEmpty]}
              onPress={() => onChange(segValue)}
              hitSlop={4}
            />
          );
        })}
      </View>

      {/* End labels */}
      <View style={styles.endLabels}>
        <GText variant="caption">{lowEnd}</GText>
        <GText variant="caption">{highEnd}</GText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueText: {
    color: colors.red,
  },
  segments: {
    flexDirection: 'row',
    gap: 3,
  },
  segment: {
    flex: 1,
    height: 24,
  },
  segmentFilled: {
    backgroundColor: colors.red,
  },
  segmentEmpty: {
    backgroundColor: colors.borderSoft,
  },
  endLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
