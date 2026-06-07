import { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import { GText } from '../GText';
import { StepNav } from './StepNav';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { StepProps } from './types';
import type { VibeTag } from '../../types';

const VIBE_TAGS: { tag: VibeTag; description: string }[] = [
  {
    tag: 'KOOK CANNON',
    description: "Forgiving enough that even your mate who \"surfs\" can ride it. No shame. Every legend started on one.",
  },
  {
    tag: 'HIPSTER SLED',
    description: "Hand-shaped by a bloke named after a tree. You ride it ironically. Sure you do.",
  },
  {
    tag: 'CORE LORD STICK',
    description: "You've surfed this break since before it had a car park. This board says that without you having to.",
  },
  {
    tag: "SOUL SURFER'S ENLIGHTENMENT",
    description: "You don't count waves. You don't wear a leash. You've said \"it's all about the glide\" without irony.",
  },
  {
    tag: 'THE MIDLIFE GLIDE',
    description: "You used to rip. Now you cruise. Your knees made the call. You just haven't told anyone yet.",
  },
];

export function VibeCheckStep({ onUpdate, onNext, onBack }: StepProps) {
  const [index, setIndex] = useState(0);
  const current = VIBE_TAGS[index];

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(VIBE_TAGS.length - 1, i + 1));

  const handleSelect = () => {
    onUpdate({ vibeTag: current.tag });
    onNext();
  };

  const handleSkip = () => {
    onUpdate({ vibeTag: undefined });
    onNext();
  };

  return (
    <View style={styles.container}>
      {/* Nav */}
      <StepNav onBack={onBack} label="2 OF 3" />

      {/* Header */}
      <View style={styles.header}>
        <GText variant="displayL">THE VIBE CHECK</GText>
        <GText variant="bodyM" color={colors.textMid}>Pick one. Your mates already know.</GText>
      </View>

      {/* Card carousel */}
      <View style={styles.carousel}>
        <Pressable onPress={prev} hitSlop={12} style={styles.arrow} disabled={index === 0}>
          <CaretLeft size={24} color={index === 0 ? colors.borderSoft : colors.text} weight="bold" />
        </Pressable>

        <View style={styles.card}>
          <GText variant="displayM" style={styles.tagName}>{current.tag}</GText>
          <GText variant="bodyM" color={colors.textMid} style={styles.tagDesc}>{current.description}</GText>
        </View>

        <Pressable onPress={next} hitSlop={12} style={styles.arrow} disabled={index === VIBE_TAGS.length - 1}>
          <CaretRight size={24} color={index === VIBE_TAGS.length - 1 ? colors.borderSoft : colors.text} weight="bold" />
        </Pressable>
      </View>

      {/* Counter */}
      <View style={styles.counter}>
        <GText variant="caption">{index + 1} OF {VIBE_TAGS.length}</GText>
      </View>

      {/* CTAs */}
      <View style={styles.actions}>
        <Pressable style={styles.cta} onPress={handleSelect}>
          <GText variant="displayS" color={colors.white}>THAT'S THE ONE</GText>
        </Pressable>

        <Pressable onPress={handleSkip} style={styles.skip}>
          <GText variant="label" color={colors.textLight}>
            SKIP — I'M NOT THAT JUDGY (YES YOU ARE)
          </GText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: spacing.xl,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  header: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing['2xl'],
  },
  carousel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    flex: 1,
  },
  arrow: {
    padding: spacing.sm,
  },
  card: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
    minHeight: 160,
    justifyContent: 'center',
  },
  tagName: {
    textAlign: 'center',
  },
  tagDesc: {
    textAlign: 'center',
    lineHeight: 22,
  },
  counter: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  actions: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
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
