import { useEffect, useMemo, useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { GText } from './GText';
import { getShapers } from '@glidr/data';
import type { Shaper } from '@glidr/data';
import { supabase } from '../lib/supabase';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fonts } from '../theme/typography';

interface Props {
  name: string;
  onChangeName: (name: string) => void;
  onResolve: (shaperId: string | null) => void;
}

export function ShaperAutocomplete({ name, onChangeName, onResolve }: Props) {
  const [shapers, setShapers] = useState<Shaper[]>([]);
  const [focused, setFocused] = useState(false);

  useEffect(() => { getShapers(supabase).then(setShapers).catch(() => {}); }, []);

  const q = name.trim().toLowerCase();
  const matches = useMemo(
    () => (q ? shapers.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 5) : []),
    [shapers, q],
  );
  const exact = shapers.some((s) => s.name.toLowerCase() === q);

  return (
    <View>
      <TextInput
        style={styles.input}
        value={name}
        onFocus={() => setFocused(true)}
        onChangeText={(t) => { onChangeName(t); onResolve(null); }}
        placeholder="e.g. Christenson"
        placeholderTextColor={colors.textLight}
        autoCapitalize="words"
      />
      {focused && q.length > 0 && (
        <View style={styles.menu}>
          {matches.map((s) => (
            <Pressable key={s.id} style={styles.item} onPress={() => { onChangeName(s.name); onResolve(s.id); setFocused(false); }}>
              <GText variant="bodyM">{s.name}</GText>
            </Pressable>
          ))}
          {!exact && (
            <View style={[styles.item, styles.createRow]}>
              <GText variant="bodyM" color={colors.red}>+ Add "{name.trim()}" as a new shaper</GText>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.text, borderWidth: 2, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, letterSpacing: 0.5 },
  menu: { borderWidth: 1, borderColor: colors.borderSoft, borderTopWidth: 0, backgroundColor: colors.surfaceCard },
  item: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  createRow: { borderBottomWidth: 0 },
});
