import { ScrollView, Pressable, StyleSheet } from 'react-native';
import { GText } from './GText';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface ChipsProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export function Chips({ options, selected, onSelect }: ChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map((option) => {
        const isActive = option === selected;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <GText
              variant="tag"
              color={isActive ? colors.white : colors.textLight}
            >
              {option}
            </GText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  chipActive: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
});
