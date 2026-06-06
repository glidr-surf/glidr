import { View, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GText } from '../GText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { StepProps } from './types';
import type { WaveSize, WaveQuality } from '../../types';

const WAVE_SIZES: WaveSize[] = [
  'ANKLE BITERS',
  'WAIST-CHEST',
  'HEAD HIGH',
  'OVERHEAD',
  'DOUBLE OVERHEAD',
  'THE EDDIE',
];

const WAVE_QUALITIES: WaveQuality[] = [
  'TUESDAY SLOP',
  'AVERAGE DAY',
  'FUN ONES',
  'PROPER WAVES',
  'GREEN ROOMS',
];

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

export function ConditionsStep({ state, onUpdate, onNext, onSkip }: StepProps) {
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
        <GText variant="caption">DEEP DIVE · 2 OF 4</GText>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <GText variant="displayL">WHAT DID YOU FEED IT?</GText>
          <GText variant="bodyM" color={colors.textMid}>Tick all that apply, no cap.</GText>
        </View>

        {/* Wave Size */}
        <View style={styles.section}>
          <GText variant="label" style={styles.sectionLabel}>WAVE SIZE</GText>
          <View style={styles.chips}>
            {WAVE_SIZES.map((size) => {
              const selected = state.waveSizes.includes(size);
              return (
                <Pressable
                  key={size}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => onUpdate({ waveSizes: toggleItem(state.waveSizes, size) })}
                >
                  <GText variant="caption" style={selected ? styles.chipTextSelected : styles.chipText}>
                    {size}
                  </GText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Wave Quality */}
        <View style={styles.section}>
          <GText variant="label" style={styles.sectionLabel}>WAVE QUALITY</GText>
          <View style={styles.chips}>
            {WAVE_QUALITIES.map((quality) => {
              const selected = state.waveQualities.includes(quality);
              return (
                <Pressable
                  key={quality}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => onUpdate({ waveQualities: toggleItem(state.waveQualities, quality) })}
                >
                  <GText variant="caption" style={selected ? styles.chipTextSelected : styles.chipText}>
                    {quality}
                  </GText>
                </Pressable>
              );
            })}
          </View>
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
