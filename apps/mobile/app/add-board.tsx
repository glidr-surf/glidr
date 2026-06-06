import { useState } from 'react';
import { View, ScrollView, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import { Screen } from '../src/components/Screen';
import { GText } from '../src/components/GText';
import { ShaperAutocomplete } from '../src/components/ShaperAutocomplete';
import { ImageField } from '../src/components/ImageField';
import { navBack } from '../src/utils/navBack';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { fonts } from '../src/theme/typography';
import { BOARD_TYPES } from '../src/theme/boardTypes';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/lib/supabase';
import { submitShaper, submitBoard, uploadImage } from '@glidr/data';
import type { BoardType } from '@glidr/data';
import type { PickedImage } from '../src/lib/pickImage';

export default function AddBoardScreen() {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const [shaperName, setShaperName] = useState('');
  const [shaperId, setShaperId] = useState<string | null>(null);
  const [model, setModel] = useState('');
  const [boardType, setBoardType] = useState<BoardType | null>(null);
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [thickness, setThickness] = useState('');
  const [volume, setVolume] = useState('');
  const [photo, setPhoto] = useState<PickedImage | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = shaperName.trim().length > 0 && model.trim().length > 0 && boardType !== null;

  const onSubmit = () =>
    requireAuth(async () => {
      if (!isValid || submitting) return;
      setSubmitting(true);
      setError(null);
      try {
        const sid = shaperId ?? (await submitShaper(supabase, { name: shaperName.trim() }));
        const opt = (s: string) => (s.trim() ? s.trim() : undefined);
        const boardId = await submitBoard(supabase, {
          name: model.trim(),
          shaperId: sid,
          type: boardType!,
          length: opt(length),
          width: opt(width),
          thickness: opt(thickness),
          volume: opt(volume),
        });
        if (photo) {
          await uploadImage(supabase, {
            ownerType: 'board',
            ownerId: boardId,
            file: photo.blob,
            ext: photo.ext,
            contentType: photo.contentType,
            replace: true,
          });
        }
        router.replace(`/board/${boardId}` as any);
      } catch {
        setError("Couldn't add that board. Try again.");
        setSubmitting(false);
      }
    });

  return (
    <Screen edges={['top']}>
      <View style={styles.nav}>
        <Pressable onPress={() => navBack(router)} style={styles.navButton} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back">
          <CaretLeft size={20} color={colors.text} weight="bold" />
        </Pressable>
        <GText variant="displayS">ADD A BOARD</GText>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <GText variant="bodyM" color={colors.textMid} style={styles.subtitle}>
          Obscure shaper? Local legend? We want it all.
        </GText>

        <View style={styles.field}>
          <GText variant="label">SHAPER *</GText>
          <ShaperAutocomplete name={shaperName} onChangeName={setShaperName} onResolve={setShaperId} />
        </View>

        <View style={styles.field}>
          <GText variant="label">MODEL NAME *</GText>
          <TextInput style={styles.input} value={model} onChangeText={setModel} placeholder="e.g. Flat Tracker" placeholderTextColor={colors.textLight} autoCapitalize="words" />
        </View>

        <View style={styles.field}>
          <GText variant="label">BOARD TYPE *</GText>
          <View style={styles.chips}>
            {BOARD_TYPES.map((type) => {
              const selected = boardType === type;
              return (
                <Pressable key={type} onPress={() => setBoardType(type)} style={[styles.chip, selected ? styles.chipSelected : styles.chipUnselected]}>
                  <GText variant="caption" color={selected ? colors.white : colors.textMid}>{type}</GText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.field}>
          <GText variant="label">DIMENSIONS (OPTIONAL)</GText>
          <View style={styles.dimsRow}>
            <TextInput style={[styles.input, styles.dimInput]} value={length} onChangeText={setLength} placeholder={"Length e.g. 5'10\""} placeholderTextColor={colors.textLight} />
            <TextInput style={[styles.input, styles.dimInput]} value={width} onChangeText={setWidth} placeholder={'Width e.g. 19"'} placeholderTextColor={colors.textLight} />
          </View>
          <View style={styles.dimsRow}>
            <TextInput style={[styles.input, styles.dimInput]} value={thickness} onChangeText={setThickness} placeholder={'Thick e.g. 2.5"'} placeholderTextColor={colors.textLight} />
            <TextInput style={[styles.input, styles.dimInput]} value={volume} onChangeText={setVolume} placeholder="Vol e.g. 30L" placeholderTextColor={colors.textLight} />
          </View>
        </View>

        <View style={styles.field}>
          <GText variant="label">PHOTO (OPTIONAL)</GText>
          <ImageField onPicked={setPhoto} />
        </View>

        {error && <GText variant="caption" color={colors.red} style={styles.error}>{error}</GText>}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={[styles.cta, (!isValid || submitting) && styles.ctaDisabled]} onPress={onSubmit} disabled={!isValid || submitting}>
          {submitting ? <ActivityIndicator color={colors.white} /> : <GText variant="label" color={colors.white}>ADD BOARD</GText>}
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  navButton: { padding: spacing.xs },
  navSpacer: { width: 20 + spacing.xs * 2 },
  content: { padding: spacing.xl, gap: spacing.xl, paddingBottom: spacing['3xl'] },
  subtitle: { marginBottom: -spacing.sm },
  field: { gap: spacing.sm },
  input: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.text, borderWidth: 2, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, letterSpacing: 0.5 },
  dimsRow: { flexDirection: 'row', gap: spacing.sm },
  dimInput: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderWidth: 1 },
  chipSelected: { backgroundColor: colors.red, borderColor: colors.red },
  chipUnselected: { borderColor: colors.borderSoft },
  error: { textAlign: 'center' },
  footer: { padding: spacing.xl },
  cta: { backgroundColor: colors.red, paddingVertical: spacing.lg, alignItems: 'center' },
  ctaDisabled: { opacity: 0.3 },
});
