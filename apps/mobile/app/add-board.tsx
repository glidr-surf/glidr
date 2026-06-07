import { useState } from 'react';
import { View, ScrollView, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { CaretLeft, X, Check } from 'phosphor-react-native';
import { Screen } from '../src/components/Screen';
import { GText } from '../src/components/GText';
import { ShaperAutocomplete } from '../src/components/ShaperAutocomplete';
import { ImageField } from '../src/components/ImageField';
import { DimensionFields } from '../src/components/DimensionFields';
import { navBack } from '../src/utils/navBack';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { fonts } from '../src/theme/typography';
import { BOARD_TYPES, boardTypeColors } from '../src/theme/boardTypes';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/lib/supabase';
import { submitShaper, submitBoard, uploadImage } from '@glidr/data';
import type { BoardType } from '@glidr/data';
import type { PickedImage } from '../src/lib/pickImage';

const TYPE_DESC: Record<string, string> = {
  FISH: 'Twin-fin, small-wave fun',
  LOG: 'Single-fin glide',
  MID: 'The do-it-all mid-length',
  SHORT: 'High-performance shred',
  ALT: 'Weird and wonderful',
  GUN: 'Big-wave charger',
};

export default function AddBoardScreen() {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shaperName, setShaperName] = useState('');
  const [shaperId, setShaperId] = useState<string | null>(null);
  const [model, setModel] = useState('');
  const [boardType, setBoardType] = useState<BoardType | null>(null);
  const [length, setLength] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [thickness, setThickness] = useState<number | null>(null);
  const [volume, setVolume] = useState<number | null>(null);
  const [photo, setPhoto] = useState<PickedImage | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step1Valid = shaperName.trim().length > 0 && model.trim().length > 0;

  const onSubmit = () =>
    requireAuth(async () => {
      if (submitting) return;
      setSubmitting(true);
      setError(null);
      try {
        const sid = shaperId ?? (await submitShaper(supabase, { name: shaperName.trim() }));
        const boardId = await submitBoard(supabase, {
          name: model.trim(),
          shaperId: sid,
          type: boardType!,
          length: length ?? undefined,
          width: width ?? undefined,
          thickness: thickness ?? undefined,
          volume: volume ?? undefined,
        });
        if (photo) {
          await uploadImage(supabase, { ownerType: 'board', ownerId: boardId, file: photo.blob, ext: photo.ext, contentType: photo.contentType, replace: true });
        }
        router.replace(`/board/${boardId}` as any);
      } catch {
        setError("Couldn't add that board. Try again.");
        setSubmitting(false);
      }
    });

  const goBack = () => (step === 1 ? navBack(router) : setStep((s) => (s - 1) as 1 | 2));

  return (
    <Screen edges={['top']}>
      <View style={styles.nav}>
        <Pressable onPress={goBack} style={styles.navButton} hitSlop={8} accessibilityRole="button" accessibilityLabel={step === 1 ? 'Close' : 'Back'}>
          {step === 1 ? <X size={20} color={colors.text} weight="bold" /> : <CaretLeft size={20} color={colors.text} weight="bold" />}
        </Pressable>
        <GText variant="label" color={colors.textMid}>STEP {step} OF 3</GText>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {step === 1 && (
          <>
            <GText variant="displayL" style={styles.h}>THE BASICS</GText>
            <GText variant="bodyM" color={colors.textMid} style={styles.sub}>Obscure shaper? Local legend? We want it all.</GText>
            <View style={styles.field}>
              <GText variant="label">PHOTO <GText variant="label" color={colors.textLight}>(OPTIONAL)</GText></GText>
              <ImageField testID="add-board-photo" onPicked={setPhoto} />
            </View>
            <View style={styles.field}>
              <GText variant="label">SHAPER</GText>
              <ShaperAutocomplete name={shaperName} onChangeName={setShaperName} onResolve={setShaperId} />
            </View>
            <View style={styles.field}>
              <GText variant="label">MODEL NAME</GText>
              <TextInput style={styles.input} value={model} onChangeText={setModel} placeholder="e.g. Flat Tracker" placeholderTextColor={colors.textLight} autoCapitalize="words" />
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <GText variant="displayL" style={styles.h}>WHAT KIND OF BOARD?</GText>
            <View style={styles.typeList}>
              {BOARD_TYPES.map((type) => {
                const selected = boardType === type;
                return (
                  <Pressable key={type} onPress={() => setBoardType(type)} style={[styles.typeCard, selected && styles.typeCardOn]}>
                    <View style={[styles.typeBar, { backgroundColor: boardTypeColors[type] ?? colors.blue }]} />
                    <View style={styles.typeInfo}>
                      <GText variant="displayS">{type}</GText>
                      <GText variant="caption" color={colors.textMid}>{TYPE_DESC[type] ?? ''}</GText>
                    </View>
                    {selected && <Check size={20} color={colors.text} weight="bold" />}
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <GText variant="displayL" style={styles.h}>DIMENSIONS</GText>
            <GText variant="bodyM" color={colors.textMid} style={styles.sub}>Optional — tap to set, or skip straight to adding.</GText>
            <DimensionFields
              value={{ length, width, thickness, volume }}
              onChange={(d) => { setLength(d.length); setWidth(d.width); setThickness(d.thickness); setVolume(d.volume); }}
            />
            {error && <GText variant="caption" color={colors.red} style={styles.error}>{error}</GText>}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step === 1 && (
          <Pressable style={[styles.cta, !step1Valid && styles.ctaDisabled]} onPress={() => step1Valid && setStep(2)} disabled={!step1Valid}>
            <GText variant="label" color={colors.white}>NEXT</GText>
          </Pressable>
        )}
        {step === 2 && (
          <Pressable style={[styles.cta, !boardType && styles.ctaDisabled]} onPress={() => boardType && setStep(3)} disabled={!boardType}>
            <GText variant="label" color={colors.white}>NEXT</GText>
          </Pressable>
        )}
        {step === 3 && (
          <Pressable style={[styles.cta, submitting && styles.ctaDisabled]} onPress={onSubmit} disabled={submitting}>
            {submitting ? <ActivityIndicator color={colors.white} /> : <GText variant="label" color={colors.white}>ADD BOARD</GText>}
          </Pressable>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  navButton: { padding: spacing.xs },
  navSpacer: { width: 20 + spacing.xs * 2 },
  content: { padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing['3xl'] },
  h: { marginBottom: -spacing.xs },
  sub: { marginBottom: spacing.sm },
  field: { gap: spacing.sm },
  input: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.text, borderWidth: 2, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.md, letterSpacing: 0.5 },
  typeList: { gap: spacing.sm },
  typeCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 2, borderColor: colors.borderSoft, borderRadius: 6, padding: spacing.md },
  typeCardOn: { borderColor: colors.text, backgroundColor: colors.surfaceCard },
  typeBar: { width: 12, height: 40, borderRadius: 3 },
  typeInfo: { flex: 1, gap: 2 },
  error: { textAlign: 'center', marginTop: spacing.sm },
  footer: { padding: spacing.xl },
  cta: { backgroundColor: colors.red, paddingVertical: spacing.lg, alignItems: 'center' },
  ctaDisabled: { opacity: 0.3 },
});
