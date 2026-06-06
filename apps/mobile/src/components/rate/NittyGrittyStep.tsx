import { useState } from 'react';
import { View, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GText } from '../GText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import {
  DimensionPicker,
  FEET,
  INCHES,
  WIDTH_WHOLE,
  WIDTH_FRAC,
  THICK_WHOLE,
  THICK_FRAC,
  VOLUME,
} from './DimensionPicker';
import type { StepProps } from './types';
import type { QuiverRole, FinSetup } from '../../types';

const QUIVER_ROLES: QuiverRole[] = [
  'DAILY DRIVER',
  'GROVELLER',
  "WHEN IT'S PUMPING",
  'TRAVEL STICK',
  'FROTH MACHINE',
  'GARAGE ART',
];

const FIN_SETUPS: FinSetup[] = ['SINGLE', 'TWIN', 'TRI', 'QUAD', '2+1', 'FINLESS'];

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

function parseFeetInches(val?: string): { feet: string; inches: string } {
  if (!val) return { feet: "6'", inches: '0"' };
  const match = val.match(/(\d+)'(\d+)"/);
  if (match) return { feet: `${match[1]}'`, inches: `${match[2]}"` };
  return { feet: "6'", inches: '0"' };
}

function parseWholeFrac(val?: string, defaultWhole = '19'): { whole: string; frac: string } {
  if (!val) return { whole: defaultWhole, frac: '0' };
  const match = val.match(/^(\d+)\s*(\d+\/\d+)?/);
  if (match) return { whole: match[1], frac: match[2] ?? '0' };
  return { whole: defaultWhole, frac: '0' };
}

type DimKey = 'length' | 'width' | 'thickness' | 'volume';

export function NittyGrittyStep({ state, onUpdate, onNext, onSkip }: StepProps) {
  const [expandedDim, setExpandedDim] = useState<DimKey | null>(null);

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onNext();
    }
  };

  const toggleDim = (key: DimKey) => {
    setExpandedDim((prev) => (prev === key ? null : key));
  };

  const lengthParsed = parseFeetInches(state.boardLength);
  const [lengthFeet, setLengthFeet] = useState(lengthParsed.feet);
  const [lengthInches, setLengthInches] = useState(lengthParsed.inches);

  const updateLength = (feet: string, inches: string) => {
    setLengthFeet(feet);
    setLengthInches(inches);
    const ft = feet.replace("'", '');
    const inc = inches.replace('"', '');
    onUpdate({ boardLength: `${ft}'${inc}"` });
  };

  const widthParsed = parseWholeFrac(state.boardWidth);
  const [widthWhole, setWidthWhole] = useState(widthParsed.whole);
  const [widthFrac, setWidthFrac] = useState(widthParsed.frac);

  const updateWidth = (whole: string, frac: string) => {
    setWidthWhole(whole);
    setWidthFrac(frac);
    const display = frac === '0' ? `${whole}"` : `${whole} ${frac}"`;
    onUpdate({ boardWidth: display });
  };

  const thickParsed = parseWholeFrac(state.boardThickness, '2');
  const [thickWhole, setThickWhole] = useState(thickParsed.whole);
  const [thickFrac, setThickFrac] = useState(thickParsed.frac);

  const updateThickness = (whole: string, frac: string) => {
    setThickWhole(whole);
    setThickFrac(frac);
    const display = frac === '0' ? `${whole}"` : `${whole} ${frac}"`;
    onUpdate({ boardThickness: display });
  };

  const [volumeVal, setVolumeVal] = useState(
    state.boardVolume != null
      ? state.boardVolume % 1 === 0
        ? `${state.boardVolume}.0`
        : `${state.boardVolume}`
      : '30.0',
  );

  const updateVolume = (val: string) => {
    setVolumeVal(val);
    onUpdate({ boardVolume: parseFloat(val) });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.nav}>
        <View />
        <GText variant="caption">DEEP DIVE · 3 OF 4</GText>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <GText variant="displayL">THE NITTY GRITTY</GText>
          <GText variant="bodyM" color={colors.textMid}>For the nerds. We respect it.</GText>
        </View>

        {/* Quiver Role */}
        <View style={styles.section}>
          <GText variant="label" style={styles.sectionLabel}>QUIVER ROLE</GText>
          <View style={styles.chips}>
            {QUIVER_ROLES.map((role) => {
              const selected = state.quiverRole === role;
              return (
                <Pressable
                  key={role}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => onUpdate({ quiverRole: selected ? undefined : role })}
                >
                  <GText variant="caption" style={selected ? styles.chipTextSelected : styles.chipText}>
                    {role}
                  </GText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Fins — multi-select */}
        <View style={styles.section}>
          <GText variant="label" style={styles.sectionLabel}>FINS</GText>
          <View style={styles.chips}>
            {FIN_SETUPS.map((fin) => {
              const selected = state.finSetup.includes(fin);
              return (
                <Pressable
                  key={fin}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => onUpdate({ finSetup: toggleItem(state.finSetup, fin) })}
                >
                  <GText variant="caption" style={selected ? styles.chipTextSelected : styles.chipText}>
                    {fin}
                  </GText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Dimensions */}
        <View style={styles.section}>
          <GText variant="label" style={styles.sectionLabel}>DIMENSIONS</GText>

          <DimensionPicker
            label="LENGTH"
            displayValue={state.boardLength}
            expanded={expandedDim === 'length'}
            onToggle={() => toggleDim('length')}
            wheels={[
              {
                values: FEET,
                selectedValue: lengthFeet,
                onValueChange: (v) => updateLength(v, lengthInches),
                width: 100,
              },
              {
                values: INCHES,
                selectedValue: lengthInches,
                onValueChange: (v) => updateLength(lengthFeet, v),
                width: 100,
              },
            ]}
          />

          <DimensionPicker
            label="WIDTH"
            displayValue={state.boardWidth}
            expanded={expandedDim === 'width'}
            onToggle={() => toggleDim('width')}
            wheels={[
              {
                values: WIDTH_WHOLE,
                selectedValue: widthWhole,
                onValueChange: (v) => updateWidth(v, widthFrac),
                width: 80,
              },
              {
                values: WIDTH_FRAC,
                selectedValue: widthFrac,
                onValueChange: (v) => updateWidth(widthWhole, v),
                width: 120,
              },
            ]}
          />

          <DimensionPicker
            label="THICKNESS"
            displayValue={state.boardThickness}
            expanded={expandedDim === 'thickness'}
            onToggle={() => toggleDim('thickness')}
            wheels={[
              {
                values: THICK_WHOLE,
                selectedValue: thickWhole,
                onValueChange: (v) => updateThickness(v, thickFrac),
                width: 80,
              },
              {
                values: THICK_FRAC,
                selectedValue: thickFrac,
                onValueChange: (v) => updateThickness(thickWhole, v),
                width: 120,
              },
            ]}
          />

          <DimensionPicker
            label="VOLUME"
            displayValue={state.boardVolume != null ? `${state.boardVolume}L` : undefined}
            expanded={expandedDim === 'volume'}
            onToggle={() => toggleDim('volume')}
            wheels={[
              {
                values: VOLUME,
                selectedValue: volumeVal,
                onValueChange: updateVolume,
              },
            ]}
          />
        </View>
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
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing['2xl'],
  },
  section: {
    marginBottom: spacing['2xl'],
    gap: spacing.md,
  },
  sectionLabel: {
    marginBottom: spacing.xs,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chipSelected: {
    backgroundColor: colors.red,
  },
  chipText: {
    color: colors.textMid,
  },
  chipTextSelected: {
    color: colors.white,
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
