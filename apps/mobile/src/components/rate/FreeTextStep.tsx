import { View, Pressable, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GText } from '../GText';
import { StepNav } from './StepNav';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/typography';
import type { StepProps } from './types';

const MAX_CHARS = 500;

export function FreeTextStep({ state, onUpdate, onNext, onSkip, onBack, stepLabel }: StepProps) {
  const charCount = state.text?.length ?? 0;

  const handleSkip = () => {
    if (onSkip) onSkip();
    else onNext();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <StepNav onBack={onBack} label={stepLabel} />

        <View style={styles.header}>
          <GText variant="displayL">GO ON THEN</GText>
          <GText variant="bodyM" color={colors.textMid}>
            Blame the board. Blame the tide. Blame that bloke who snaked you. We're here for it.
          </GText>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            testID="rate-freetext-input"
            style={styles.textInput}
            value={state.text ?? ''}
            onChangeText={(t) => {
              if (t.length <= MAX_CHARS) onUpdate({ text: t });
            }}
            placeholder="Paddled out on a 2ft Tuesday. Felt like Dane for three turns. Then a set came and I remembered I'm a 38-year-old accountant..."
            placeholderTextColor={colors.textLight}
            multiline
            textAlignVertical="top"
            maxLength={MAX_CHARS}
          />
          <GText variant="label" style={styles.charCount}>
            {charCount}/{MAX_CHARS}
          </GText>
        </View>

        <View style={styles.actions}>
          <Pressable testID="rate-next" style={styles.cta} onPress={onNext}>
            <GText variant="displayS" color={colors.white}>SEND IT</GText>
          </Pressable>
          <Pressable onPress={handleSkip} style={styles.skip}>
            <GText variant="label" color={colors.textLight}>SKIP — ACTIONS SPEAK LOUDER</GText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing['2xl'],
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  charCount: {
    textAlign: 'right',
    marginTop: spacing.sm,
    color: colors.textLight,
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
