import { useState } from 'react';
import { View, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GText } from '../GText';
import { StepNav } from './StepNav';
import { DimensionFields, EMPTY_DIMS, type Dims } from '../DimensionFields';
import { formatLength, formatInches } from '../../utils/dims';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { StepProps } from './types';

/** Board dimensions you rode — own page, shares DimensionFields with add-board. */
export function DimensionsStep({ state, onUpdate, onNext, onSkip, onBack, stepLabel }: StepProps) {
  const [dims, setDims] = useState<Dims>({ ...EMPTY_DIMS, volume: state.boardVolume ?? null });

  const handleSkip = () => {
    if (onSkip) onSkip();
    else onNext();
  };

  const updateDims = (d: Dims) => {
    setDims(d);
    onUpdate({
      boardLength: d.length != null ? formatLength(d.length) : undefined,
      boardWidth: d.width != null ? formatInches(d.width, 8) : undefined,
      boardThickness: d.thickness != null ? formatInches(d.thickness, 16) : undefined,
      boardVolume: d.volume ?? undefined,
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StepNav onBack={onBack} label={stepLabel} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <GText variant="displayL">DIMENSIONS</GText>
          <GText variant="bodyM" color={colors.textMid}>What did you actually ride? Optional — but the nerds love it.</GText>
        </View>
        <DimensionFields value={dims} onChange={updateDims} />
      </ScrollView>
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
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  header: { gap: spacing.sm, marginBottom: spacing['2xl'] },
  actions: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, paddingTop: spacing.lg, gap: spacing.md },
  cta: { backgroundColor: colors.red, paddingVertical: spacing.lg, alignItems: 'center' },
  skip: { alignItems: 'center', paddingVertical: spacing.sm },
});
