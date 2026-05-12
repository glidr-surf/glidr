import { View, Pressable, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GText } from '../GText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';
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

export function NittyGrittyStep({ state, onUpdate, onNext, onSkip }: StepProps) {
  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onNext();
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Nav */}
      <View style={styles.nav}>
        <View />
        <GText variant="micro">DEEP DIVE · 3 OF 4</GText>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <GText variant="displayL">THE NITTY GRITTY</GText>
          <GText variant="bodyM" color={colors.textMid}>For the nerds. We respect it.</GText>
        </View>

        {/* Quiver Role */}
        <View style={styles.section}>
          <GText variant="label" style={styles.sectionLabel}>QUIVER ROLE</GText>
          <View style={styles.chips}>
            {QUIVER_ROLES.map((role) => {
              const selected = state.quiverRole === role;
              return (
                <Pressable
                  key={role}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => onUpdate({ quiverRole: selected ? undefined : role })}
                >
                  <GText variant="tag" style={selected ? styles.chipTextSelected : styles.chipText}>
                    {role}
                  </GText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Fins */}
        <View style={styles.section}>
          <GText variant="label" style={styles.sectionLabel}>FINS</GText>
          <View style={styles.chips}>
            {FIN_SETUPS.map((fin) => {
              const selected = state.finSetup === fin;
              return (
                <Pressable
                  key={fin}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => onUpdate({ finSetup: selected ? undefined : fin })}
                >
                  <GText variant="tag" style={selected ? styles.chipTextSelected : styles.chipText}>
                    {fin}
                  </GText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Board Length */}
        <View style={styles.section}>
          <GText variant="label" style={styles.sectionLabel}>BOARD LENGTH</GText>
          <TextInput
            style={styles.textInput}
            value={state.boardLength ?? ''}
            onChangeText={(t) => onUpdate({ boardLength: t })}
            placeholder={"e.g. 6'2\""}
            placeholderTextColor={colors.textLight}
          />
        </View>
      </ScrollView>

      {/* CTAs */}
      <View style={styles.actions}>
        <Pressable style={styles.cta} onPress={onNext}>
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
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing['2xl'],
  },
  section: {
    marginBottom: spacing['2xl'],
    gap: spacing.md,
  },
  sectionLabel: {
    marginBottom: spacing.xs,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chipSelected: {
    backgroundColor: colors.red,
  },
  chipText: {
    color: colors.textMid,
  },
  chipTextSelected: {
    color: colors.white,
  },
  textInput: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.text,
  },
  actions: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  cta: {
    backgroundColor: colors.red,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  skip: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
});
