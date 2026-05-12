import { useState } from 'react';
import { View, ScrollView, TextInput, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import { GText } from '../src/components/GText';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { fonts } from '../src/theme/typography';
import { BOARD_TYPES } from '../src/theme/boardTypes';
import type { BoardType } from '../src/types';

export default function AddBoardScreen() {
  const router = useRouter();
  const [shaper, setShaper] = useState('');
  const [model, setModel] = useState('');
  const [boardType, setBoardType] = useState<BoardType | null>(null);

  const isValid = shaper.trim().length > 0 && model.trim().length > 0 && boardType !== null;

  function handleSubmit() {
    if (!isValid) return;
    Alert.alert(
      'Board Added',
      `${shaper} ${model} is now in the database. Go find someone to ride it.`,
      [{ text: 'NICE', onPress: () => router.back() }],
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Nav bar */}
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()} style={styles.navButton} hitSlop={8}>
          <CaretLeft size={20} color={colors.text} weight="bold" />
        </Pressable>
        <GText variant="displayS">ADD A BOARD</GText>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <GText variant="bodyM" color={colors.textMid} style={styles.subtitle}>
          Obscure shaper? Local legend? We want it all.
        </GText>

        {/* Shaper Name */}
        <View style={styles.field}>
          <GText variant="label">SHAPER NAME *</GText>
          <TextInput
            style={styles.input}
            value={shaper}
            onChangeText={setShaper}
            placeholder="e.g. Christenson"
            placeholderTextColor={colors.textLight}
            autoCapitalize="words"
          />
        </View>

        {/* Model Name */}
        <View style={styles.field}>
          <GText variant="label">MODEL NAME *</GText>
          <TextInput
            style={styles.input}
            value={model}
            onChangeText={setModel}
            placeholder="e.g. Flat Tracker"
            placeholderTextColor={colors.textLight}
            autoCapitalize="words"
          />
        </View>

        {/* Board Type */}
        <View style={styles.field}>
          <GText variant="label">BOARD TYPE *</GText>
          <View style={styles.chips}>
            {BOARD_TYPES.map((type) => {
              const selected = boardType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setBoardType(type)}
                  style={[styles.chip, selected ? styles.chipSelected : styles.chipUnselected]}
                >
                  <GText
                    variant="caption"
                    color={selected ? colors.white : colors.textMid}
                  >
                    {type}
                  </GText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.cta, !isValid && styles.ctaDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <GText variant="label" color={colors.white}>ADD BOARD</GText>
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
    paddingVertical: spacing.md,
  },
  navButton: {
    padding: spacing.xs,
  },
  navSpacer: {
    width: 20 + spacing.xs * 2,
  },
  content: {
    padding: spacing.xl,
    gap: spacing['2xl'],
    paddingBottom: spacing['3xl'],
  },
  subtitle: {
    marginBottom: -spacing.lg,
  },
  field: {
    gap: spacing.sm,
  },
  input: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    letterSpacing: 0.5,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: colors.red,
    borderColor: colors.red,
  },
  chipUnselected: {
    borderColor: colors.borderSoft,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xl,
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
