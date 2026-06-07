import { View, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GText } from '../GText';
import { StepNav } from './StepNav';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { StepProps } from './types';
import type { QuiverRole, FinSetup } from '../../types';

const QUIVER_ROLES: QuiverRole[] = [
  'DAILY DRIVER',
  'GROVELLER',
  "WHEN IT'S PUMPING",
  'TRAVEL STICK',
  'FROTH MACHINE',
  'GARAGE ART',
];

const FIN_SETUPS: FinSetup[] = ['SINGLE', 'TWIN', 'TRI', 'QUAD', '2+1', 'FINLESS'];

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

export function NittyGrittyStep({ state, onUpdate, onNext, onSkip, onBack, stepLabel }: StepProps) {
  const handleSkip = () => {
    if (onSkip) onSkip();
    else onNext();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StepNav onBack={onBack} label={stepLabel} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <GText variant="displayL">THE NITTY GRITTY</GText>
          <GText variant="bodyM" color={colors.textMid}>For the nerds. We respect it.</GText>
        </View>

        {/* Quiver Role */}
        <View style={styles.section}>
          <GText variant="label" style={styles.sectionLabel}>QUIVER ROLE</GText>
          <View style={styles.chips}>
            {QUIVER_ROLES.map((role) => {
              const selected = state.quiverRoles.includes(role);
              return (
                <Pressable
                  key={role}
                  testID={`nitty-role-${role}`}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => onUpdate({ quiverRoles: toggleItem(state.quiverRoles, role) })}
                >
                  <GText variant="caption" style={selected ? styles.chipTextSelected : styles.chipText}>
                    {role}
                  </GText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Fins — multi-select */}
        <View style={styles.section}>
          <GText variant="label" style={styles.sectionLabel}>FINS</GText>
          <View style={styles.chips}>
            {FIN_SETUPS.map((fin) => {
              const selected = state.finSetup.includes(fin);
              return (
                <Pressable
                  key={fin}
                  testID={`nitty-fin-${fin}`}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => onUpdate({ finSetup: toggleItem(state.finSetup, fin) })}
                >
                  <GText variant="caption" style={selected ? styles.chipTextSelected : styles.chipText}>
                    {fin}
                  </GText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Pressable testID="rate-next" style={styles.cta} onPress={onNext}>
          <GText variant="displayS" color={colors.white}>NEXT</GText>
        </Pressable>
        <Pressable onPress={handleSkip} style={styles.skip}>
          <GText variant="label" color={colors.textLight}>SKIP</GText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  header: { gap: spacing.sm, marginBottom: spacing['2xl'] },
  section: { marginBottom: spacing['2xl'], gap: spacing.md },
  sectionLabel: { marginBottom: spacing.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { backgroundColor: colors.surface, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  chipSelected: { backgroundColor: colors.red },
  chipText: { color: colors.textMid },
  chipTextSelected: { color: colors.white },
  actions: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, paddingTop: spacing.lg, gap: spacing.md },
  cta: { backgroundColor: colors.red, paddingVertical: spacing.lg, alignItems: 'center' },
  skip: { alignItems: 'center', paddingVertical: spacing.sm },
});
