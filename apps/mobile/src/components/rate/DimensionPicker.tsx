import { View, Pressable, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { GText } from '../GText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';

interface PickerWheel {
  values: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  width?: number;
}

interface DimensionPickerProps {
  label: string;
  displayValue: string | undefined;
  expanded: boolean;
  onToggle: () => void;
  wheels: PickerWheel[];
}

export function DimensionPicker({
  label,
  displayValue,
  expanded,
  onToggle,
  wheels,
}: DimensionPickerProps) {
  return (
    <View>
      <Pressable style={styles.row} onPress={onToggle}>
        <GText variant="caption" style={styles.label}>{label}</GText>
        <View style={styles.right}>
          <GText
            variant="bodyM"
            style={[styles.value, !displayValue && styles.empty]}
          >
            {displayValue ?? '—'}
          </GText>
          <GText variant="caption" style={styles.chevron}>
            {expanded ? '▲' : '▼'}
          </GText>
        </View>
      </Pressable>
      {expanded && (
        <View style={styles.pickerArea}>
          <View style={styles.wheels}>
            {wheels.map((wheel, i) => (
              <View key={i} style={[styles.wheelContainer, wheel.width ? { width: wheel.width } : undefined]}>
                <Picker
                  selectedValue={wheel.selectedValue}
                  onValueChange={wheel.onValueChange}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {wheel.values.map((v) => (
                    <Picker.Item key={v} label={v} value={v} />
                  ))}
                </Picker>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const FEET = Array.from({ length: 11 }, (_, i) => `${i + 4}'`);
const INCHES = Array.from({ length: 12 }, (_, i) => `${i}"`);

const WIDTH_WHOLE = Array.from({ length: 8 }, (_, i) => `${i + 17}`);
const WIDTH_FRAC = ['0', '1/8', '1/4', '3/8', '1/2', '5/8', '3/4', '7/8'];

const THICK_WHOLE = ['2', '3', '4'];
const THICK_FRAC = [
  '0', '1/16', '1/8', '3/16', '1/4', '5/16', '3/8', '7/16',
  '1/2', '9/16', '5/8', '11/16', '3/4', '13/16', '7/8', '15/16',
];

const VOLUME = Array.from({ length: 125 }, (_, i) => {
  const val = 18 + i * 0.5;
  return val % 1 === 0 ? `${val}.0` : `${val}`;
});

export { FEET, INCHES, WIDTH_WHOLE, WIDTH_FRAC, THICK_WHOLE, THICK_FRAC, VOLUME };

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  label: {
    letterSpacing: 2,
    color: colors.textLight,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  value: {
    fontFamily: fonts.bodyMedium,
  },
  empty: {
    color: colors.borderSoft,
  },
  chevron: {
    color: colors.textLight,
  },
  pickerArea: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
    paddingVertical: spacing.sm,
  },
  wheels: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  wheelContainer: {
    flex: 1,
  },
  picker: {
    height: 150,
  },
  pickerItem: {
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
    color: colors.text,
  },
});
