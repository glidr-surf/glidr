import { useState } from 'react';
import { View, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GText } from '../src/components/GText';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { fonts } from '../src/theme/typography';

const TAKEN_NAMES = ['SaltyDawg', 'KookPatrol'];
const SUGGESTIONS = ['SaltyFish_42', 'KookPatrol_7', 'WaxedPoetic', 'BarrelDodger_99', 'FrothGrom'];
const GREEN = '#2A7A4A';

type UniquenessState = 'empty' | 'taken' | 'available';

function getUniqueness(username: string): UniquenessState {
  if (!username) return 'empty';
  if (TAKEN_NAMES.includes(username)) return 'taken';
  return 'available';
}

export default function UsernamePickerScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [focused, setFocused] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');

  const uniqueness = getUniqueness(username);
  const canSubmit = uniqueness === 'available';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <GText variant="displayL" style={styles.title}>PICK A NAME</GText>
        <GText variant="bodyM" color={colors.textMid} style={styles.subtitle}>
          Every legend needs a callsign.
        </GText>

        {/* Username input */}
        <View style={styles.inputWrapper}>
          <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="your callsign"
              placeholderTextColor={colors.textLight}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {uniqueness !== 'empty' && (
              <View style={styles.indicator}>
                <GText
                  variant="label"
                  color={uniqueness === 'taken' ? colors.red : GREEN}
                  style={styles.indicatorMark}
                >
                  {uniqueness === 'taken' ? '✗' : '✓'}
                </GText>
                <GText variant="label" color={uniqueness === 'taken' ? colors.red : GREEN}>
                  {uniqueness === 'taken' ? 'TAKEN' : 'AVAILABLE'}
                </GText>
              </View>
            )}
          </View>
        </View>

        {/* Suggestion chips */}
        <View style={styles.chips}>
          {SUGGESTIONS.map((s) => (
            <Pressable
              key={s}
              onPress={() => setUsername(s)}
              style={styles.chip}
            >
              <GText variant="bodyM" color={colors.textMid}>{s}</GText>
            </Pressable>
          ))}
        </View>

        {/* Optional section */}
        <GText variant="label" style={styles.sectionLabel}>OPTIONAL — FOR BOARD SIZING</GText>

        <View style={styles.optionalFields}>
          <TextInput
            style={styles.optionalInput}
            value={height}
            onChangeText={setHeight}
            placeholder={units === 'imperial' ? "e.g. 5'10\"" : 'e.g. 178 cm'}
            placeholderTextColor={colors.textLight}
            keyboardType="default"
          />
          <TextInput
            style={[styles.optionalInput, styles.optionalInputLast]}
            value={weight}
            onChangeText={setWeight}
            placeholder={units === 'imperial' ? 'e.g. 165 lbs' : 'e.g. 75 kg'}
            placeholderTextColor={colors.textLight}
            keyboardType="default"
          />
        </View>

        {/* Imperial / Metric toggle */}
        <View style={styles.toggleRow}>
          <Pressable
            onPress={() => setUnits('imperial')}
            style={[styles.toggleOption, units === 'imperial' && styles.toggleActive]}
          >
            <GText variant="caption" color={units === 'imperial' ? colors.white : colors.textMid}>
              IMPERIAL
            </GText>
          </Pressable>
          <Pressable
            onPress={() => setUnits('metric')}
            style={[styles.toggleOption, units === 'metric' && styles.toggleActive]}
          >
            <GText variant="caption" color={units === 'metric' ? colors.white : colors.textMid}>
              METRIC
            </GText>
          </Pressable>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <Pressable
          onPress={() => canSubmit && router.back()}
          style={[styles.cta, !canSubmit && styles.ctaDisabled]}
        >
          <GText variant="displayS" color={colors.white}>LET'S GO</GText>
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
  content: {
    padding: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  inputWrapper: {
    marginBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  inputRowFocused: {
    borderColor: colors.red,
  },
  input: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingLeft: spacing.sm,
  },
  indicatorMark: {
    fontSize: 14,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing['2xl'],
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sectionLabel: {
    marginBottom: spacing.md,
  },
  optionalFields: {
    gap: 0,
    marginBottom: spacing.md,
  },
  optionalInput: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  optionalInputLast: {
    marginBottom: 0,
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  toggleActive: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  footer: {
    padding: spacing.xl,
    paddingTop: spacing.md,
  },
  cta: {
    backgroundColor: colors.red,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.3,
  },
});
