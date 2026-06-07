import { useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { formatLength, formatInches, formatVolume, lengthToInches, partsToInches, parseDecimal } from '../utils/dims';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fonts } from '../theme/typography';

type Kind = 'length' | 'width' | 'thickness' | 'volume';
const LABEL: Record<Kind, string> = { length: 'LENGTH', width: 'WIDTH', thickness: 'THICKNESS', volume: 'VOLUME' };
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

function display(kind: Kind, v: number): string {
  if (kind === 'length') return formatLength(v);
  if (kind === 'volume') return formatVolume(v);
  return formatInches(v, kind === 'thickness' ? 16 : 8);
}

/** Captures a board dimension as a number (decimal inches for length/width/thickness, litres for volume). */
export function DimensionPicker({ kind, value, onChange }: { kind: Kind; value: number | null; onChange: (v: number) => void }) {
  const [open, setOpen] = useState(false);
  const denom = kind === 'thickness' ? 16 : 8;
  const [mode, setMode] = useState<'fraction' | 'decimal'>('fraction');
  const [ft, setFt] = useState(5);
  const [inch, setInch] = useState(10);
  const [half, setHalf] = useState(0);
  const [whole, setWhole] = useState(kind === 'thickness' ? 2 : 19);
  const [num, setNum] = useState(0);
  const [dec, setDec] = useState('');
  const [vol, setVol] = useState(30);

  const commit = () => {
    if (kind === 'length') onChange(lengthToInches(ft, inch, half === 1));
    else if (kind === 'volume') onChange(vol);
    else if (mode === 'decimal') {
      const d = parseDecimal(dec);
      if (d == null) { setOpen(false); return; }
      onChange(d);
    } else {
      onChange(partsToInches(whole, num, denom));
    }
    setOpen(false);
  };

  const dual = kind === 'width' || kind === 'thickness';

  return (
    <View>
      <Pressable style={[styles.row, value != null && styles.rowSet]} onPress={() => setOpen(true)}>
        <Text style={styles.label}>{LABEL[kind]}</Text>
        <Text style={[styles.val, value == null && styles.placeholder]}>{value != null ? display(kind, value) : 'Set'} ▾</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHead}>
              <Text style={styles.label}>{LABEL[kind]}</Text>
              <Pressable onPress={commit} hitSlop={8}><Text style={styles.done}>Done</Text></Pressable>
            </View>

            {dual && (
              <View style={styles.modeRow}>
                {(['fraction', 'decimal'] as const).map((m) => (
                  <Pressable key={m} onPress={() => setMode(m)} style={[styles.modeBtn, mode === m && styles.modeOn]}>
                    <Text style={[styles.modeText, mode === m && styles.modeTextOn]}>{m === 'fraction' ? 'FRACTIONS' : 'DECIMAL'}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            <View style={styles.wheels}>
              {kind === 'length' && (
                <>
                  <Picker style={styles.wheel} selectedValue={ft} onValueChange={(v) => setFt(Number(v))}>{range(4, 12).map((n) => <Picker.Item key={n} label={`${n}'`} value={n} />)}</Picker>
                  <Picker style={styles.wheel} selectedValue={inch} onValueChange={(v) => setInch(Number(v))}>{range(0, 11).map((n) => <Picker.Item key={n} label={`${n}"`} value={n} />)}</Picker>
                  <Picker style={styles.wheel} selectedValue={half} onValueChange={(v) => setHalf(Number(v))}><Picker.Item label="0" value={0} /><Picker.Item label="½" value={1} /></Picker>
                </>
              )}
              {dual && mode === 'fraction' && (
                <>
                  <Picker style={styles.wheel} selectedValue={whole} onValueChange={(v) => setWhole(Number(v))}>{range(kind === 'thickness' ? 1 : 16, kind === 'thickness' ? 4 : 24).map((n) => <Picker.Item key={n} label={`${n}"`} value={n} />)}</Picker>
                  <Picker style={styles.wheel} selectedValue={num} onValueChange={(v) => setNum(Number(v))}>{range(0, denom - 1).map((n) => <Picker.Item key={n} label={n === 0 ? '0' : `${n}/${denom}`} value={n} />)}</Picker>
                </>
              )}
              {dual && mode === 'decimal' && (
                <View style={styles.decWrap}>
                  <TextInput style={styles.decInput} value={dec} onChangeText={setDec} keyboardType="decimal-pad" placeholder={kind === 'thickness' ? 'e.g. 2.56' : 'e.g. 20.5'} placeholderTextColor={colors.textLight} autoFocus />
                  <Text style={styles.decUnit}>inches</Text>
                </View>
              )}
              {kind === 'volume' && (
                <Picker style={styles.wheel} selectedValue={vol} onValueChange={(v) => setVol(Number(v))}>{range(10, 120).map((n) => <Picker.Item key={n} label={`${n} L`} value={n} />)}</Picker>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 2, borderColor: colors.text, borderRadius: 4, padding: spacing.md, marginBottom: spacing.sm },
  rowSet: { borderColor: colors.red },
  label: { fontFamily: fonts.display, fontSize: 16, letterSpacing: 0.5, color: colors.text },
  val: { fontFamily: fonts.bodySemiBold, color: colors.text },
  placeholder: { color: colors.textLight },
  backdrop: { flex: 1, backgroundColor: 'rgba(26,23,20,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surfaceCard, borderTopWidth: 2, borderColor: colors.text, paddingBottom: spacing.xl },
  sheetHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md },
  done: { fontFamily: fonts.bodySemiBold, color: colors.red, fontSize: 15 },
  modeRow: { flexDirection: 'row', marginHorizontal: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.borderSoft, borderRadius: 4, overflow: 'hidden' },
  modeBtn: { flex: 1, paddingVertical: spacing.xs, alignItems: 'center' },
  modeOn: { backgroundColor: colors.red },
  modeText: { fontFamily: fonts.bodySemiBold, fontSize: 11, letterSpacing: 0.5, color: colors.textMid },
  modeTextOn: { color: colors.white },
  wheels: { flexDirection: 'row', justifyContent: 'center', minHeight: 120 },
  wheel: { flex: 1 },
  decWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  decInput: { borderWidth: 2, borderColor: colors.text, borderRadius: 4, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontFamily: fonts.bodyMedium, fontSize: 18, color: colors.text, minWidth: 120, textAlign: 'center' },
  decUnit: { fontFamily: fonts.bodyMedium, color: colors.textMid },
});
