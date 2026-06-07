import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

const CREAM = '#F2E6CE';

interface GlidrMarkProps {
  size?: number;
  rounded?: boolean;
  testID?: string;
}

/** The Glidr G mark: red tile + cream Bebas "G" tilted 7° + a low full-width swell. */
export function GlidrMark({ size = 40, rounded = true, testID }: GlidrMarkProps) {
  return (
    <View
      testID={testID}
      style={[styles.tile, { width: size, height: size, borderRadius: rounded ? size * 0.22 : 0 }]}
    >
      <Svg width={size} height={size * 0.34} viewBox="0 0 100 34" style={[styles.swell, { bottom: size * 0.14 }]}>
        <Path d="M0 20 C 24 6, 40 6, 52 13 C 64 20, 82 20, 100 10" fill="none" stroke={CREAM} strokeWidth={7} strokeLinecap="round" />
      </Svg>
      <Text style={[styles.g, { fontSize: size * 0.92 }]}>G</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { backgroundColor: colors.red, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  swell: { position: 'absolute', left: 0 },
  g: { fontFamily: fonts.display, color: CREAM, transform: [{ rotate: '7deg' }], includeFontPadding: false },
});
