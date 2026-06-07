import { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, Pressable, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Camera } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GText } from '../src/components/GText';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';
import { fonts } from '../src/theme/typography';
import { useAuth } from '../src/context/AuthContext';
import { useUnits } from '../src/context/UnitsContext';
import { pickImage, type PickedImage } from '../src/lib/pickImage';
import { supabase } from '../src/lib/supabase';
import { isUsernameAvailable, createProfile, uploadImage } from '@glidr/data';

const SURPRISE = ['SaltyFish_42', 'KookPatrol_7', 'WaxedPoetic', 'BarrelDodger_99', 'FrothGrom', 'SoupSipper', 'ReefRash', 'DawnPatrol_88', 'GromWrangler', 'PointBreakPete'];
const GREEN = '#2A7A4A';
type UniquenessState = 'empty' | 'checking' | 'taken' | 'available';

export default function UsernamePickerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { refreshUser } = useAuth();
  const { units, setUnits } = useUnits();
  const [username, setUsername] = useState('');
  const [focused, setFocused] = useState(false);
  const [photo, setPhoto] = useState<PickedImage | null>(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [uniqueness, setUniqueness] = useState<UniquenessState>('empty');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) { setUniqueness('empty'); return; }
    setUniqueness('checking');
    const handle = setTimeout(async () => {
      try {
        const free = await isUsernameAvailable(supabase, username);
        setUniqueness(free ? 'available' : 'taken');
      } catch {
        setUniqueness('empty');
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [username]);

  const canSubmit = uniqueness === 'available' && !submitting;

  const surpriseMe = () => setUsername(SURPRISE[Math.floor(Math.random() * SURPRISE.length)]);
  const pickPhoto = async () => { const img = await pickImage(); if (img) setPhoto(img); };

  const onSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id;
      if (!userId) throw new Error('No session');
      await createProfile(supabase, { id: userId, username, height: height || undefined, weight: weight || undefined });
      if (photo) {
        await uploadImage(supabase, { ownerType: 'profile', ownerId: userId, file: photo.blob, ext: photo.ext, contentType: photo.contentType, replace: true });
      }
      await refreshUser();
      router.back();
    } catch {
      setError('Could not save that. The name may have just been taken — try another.');
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <GText variant="displayL" style={styles.title}>PICK A NAME</GText>
        <GText variant="bodyM" color={colors.textMid} style={styles.subtitle}>Every legend needs a callsign.</GText>

        <Pressable style={styles.avatar} onPress={pickPhoto} accessibilityRole="button" accessibilityLabel="Add a profile photo">
          {photo ? (
            <Image source={{ uri: photo.uri }} style={styles.avatarImg} contentFit="cover" />
          ) : (
            <Camera size={28} color={colors.textMid} weight="bold" />
          )}
        </Pressable>
        <GText variant="caption" color={colors.textMid} style={styles.avatarHint}>{photo ? 'CHANGE PHOTO' : 'ADD A PHOTO'}</GText>

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
          {uniqueness === 'checking' && <ActivityIndicator size="small" color={colors.textLight} />}
          {(uniqueness === 'taken' || uniqueness === 'available') && (
            <GText variant="label" color={uniqueness === 'taken' ? colors.red : GREEN}>
              {uniqueness === 'taken' ? 'TAKEN' : 'FREE'}
            </GText>
          )}
        </View>
        <Pressable onPress={surpriseMe} style={styles.surprise} hitSlop={8}>
          <GText variant="label" color={colors.red}>SURPRISE ME →</GText>
        </Pressable>

        <GText variant="label" style={styles.sectionLabel}>YOUR SIZE <GText variant="label" color={colors.textLight}>(OPTIONAL)</GText></GText>
        <GText variant="caption" color={colors.textMid} style={styles.sizeWhy}>Helps us recommend the right board volume.</GText>

        <Pressable
          style={styles.unitsRow}
          onPress={() => Alert.alert('Units', 'Body measurements', [
            { text: 'Imperial (ft/in, lbs)', onPress: () => setUnits('imperial') },
            { text: 'Metric (cm, kg)', onPress: () => setUnits('metric') },
            { text: 'Cancel', style: 'cancel' },
          ])}
        >
          <GText variant="bodyM">Units</GText>
          <GText variant="bodyM">{units === 'imperial' ? 'Imperial' : 'Metric'} ▾</GText>
        </Pressable>

        <View style={styles.field}>
          <GText variant="label" style={styles.fieldLabel}>HEIGHT</GText>
          <TextInput style={styles.fieldInput} value={height} onChangeText={setHeight} placeholder={units === 'imperial' ? `e.g. 5'10"` : 'e.g. 178 cm'} placeholderTextColor={colors.textLight} />
        </View>
        <View style={styles.field}>
          <GText variant="label" style={styles.fieldLabel}>WEIGHT</GText>
          <TextInput style={styles.fieldInput} value={weight} onChangeText={setWeight} placeholder={units === 'imperial' ? 'e.g. 165 lbs' : 'e.g. 75 kg'} placeholderTextColor={colors.textLight} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        {error && <GText variant="caption" color={colors.red} style={styles.errorText}>{error}</GText>}
        <Pressable onPress={() => canSubmit && onSubmit()} style={[styles.cta, !canSubmit && styles.ctaDisabled]}>
          {submitting ? <ActivityIndicator color={colors.white} /> : <GText variant="displayS" color={colors.white}>LET'S GO</GText>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, paddingBottom: spacing['2xl'] },
  title: { textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { textAlign: 'center', marginBottom: spacing.lg },
  avatar: { width: 88, height: 88, borderRadius: 44, borderWidth: 2, borderColor: colors.borderSoft, borderStyle: 'dashed', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImg: { width: 88, height: 88 },
  avatarHint: { textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.lg },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: colors.border, paddingHorizontal: spacing.md, gap: spacing.sm },
  inputRowFocused: { borderColor: colors.red },
  input: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 16, color: colors.text, paddingVertical: spacing.md },
  surprise: { alignSelf: 'flex-end', paddingVertical: spacing.sm, marginBottom: spacing.xl },
  sectionLabel: { marginBottom: spacing.xs },
  sizeWhy: { marginBottom: spacing.md },
  unitsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm, marginBottom: spacing.md },
  field: { marginBottom: spacing.md },
  fieldLabel: { marginBottom: spacing.xs },
  fieldInput: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.text, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  footer: { padding: spacing.xl, paddingTop: spacing.md },
  errorText: { marginBottom: spacing.sm, textAlign: 'center' },
  cta: { backgroundColor: colors.red, paddingVertical: spacing.lg, alignItems: 'center' },
  ctaDisabled: { opacity: 0.3 },
});
