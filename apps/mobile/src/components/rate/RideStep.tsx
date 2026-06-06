import { View, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GText } from '../GText';
import { DiscreteSlider } from './DiscreteSlider';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { StepProps } from './types';

export function RideStep({ state, onUpdate, onNext, onSkip }: StepProps) {
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
        <GText variant="caption">DEEP DIVE · 1 OF 4</GText>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <GText variant="displayL">HOW'D IT RIDE?</GText>
          <GText variant="bodyM" color={colors.textMid}>Rate it honestly. Your ego can take it.</GText>
        </View>

        {/* Sliders */}
        <View style={styles.sliders}>
          <DiscreteSlider
            label="SPEED"
            value={state.speed}
            onChange={(v) => onUpdate({ speed: v })}
            lowEnd="ABSOLUTE BOG"
            highEnd="ABSOLUTELY FLYING"
          />
          <DiscreteSlider
            label="MANOEUVRABILITY"
            value={state.manoeuvrability}
            onChange={(v) => onUpdate({ manoeuvrability: v })}
            lowEnd="BARGE"
            highEnd="WHIPPY AS"
          />
          <DiscreteSlider
            label="PADDLE POWER"
            value={state.paddlePower}
            onChange={(v) => onUpdate({ paddlePower: v })}
            lowEnd="ARM BURNER"
            highEnd="WAVE MAGNET"
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
  sliders: {
    gap: spacing['2xl'],
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
