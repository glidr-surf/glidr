import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, AccessibilityInfo, Easing } from 'react-native';
import { GlidrMark } from './GlidrMark';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

const CREAM = '#F2E6CE';

/** Cold-start brand moment: the G drops down the wave, settles, the wordmark fades in, then the overlay fades out. */
export function BrandIntro({ onDone }: { onDone: () => void }) {
  const drop = useRef(new Animated.Value(-160)).current; // G translateY
  const wordOpacity = useRef(new Animated.Value(0)).current;
  const overlay = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      const dropAnim = reduce
        ? Animated.timing(drop, { toValue: 0, duration: 1, useNativeDriver: true })
        : Animated.timing(drop, { toValue: 0, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true });
      Animated.sequence([
        dropAnim,
        Animated.timing(wordOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(250),
        Animated.timing(overlay, { toValue: 0, duration: 260, useNativeDriver: true }),
      ]).start(() => { if (!cancelled) onDone(); });
    });
    return () => { cancelled = true; };
  }, [drop, wordOpacity, overlay, onDone]);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.fill, { opacity: overlay }]} pointerEvents="none">
      <Animated.View style={{ transform: [{ translateY: drop }] }}>
        <GlidrMark size={88} rounded={false} />
      </Animated.View>
      <Animated.Text style={[styles.word, { opacity: wordOpacity }]}>GLIDR</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', gap: 16 },
  word: { fontFamily: fonts.display, color: CREAM, fontSize: 52, letterSpacing: 5 },
});
