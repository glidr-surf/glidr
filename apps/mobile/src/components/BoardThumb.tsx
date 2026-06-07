import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { boardTypeColors } from '../theme/boardTypes';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import type { Board } from '../types';

export function BoardThumb({ board, width = 46, height = 58 }: { board: Board; width?: number; height?: number }) {
  return (
    <View style={[styles.frame, { width, height }]}>
      {board.imageUrl ? (
        <>
          <Image testID="board-thumb-img" source={{ uri: board.imageUrl }} style={styles.img} contentFit="cover" contentPosition="top" transition={150} />
          <View style={styles.badge}><Text style={styles.badgeText}>{board.type}</Text></View>
        </>
      ) : (
        <View style={[styles.fallback, { backgroundColor: boardTypeColors[board.type] ?? colors.blue }]}>
          <Text style={styles.fbText}>{board.type}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { borderWidth: 2, borderColor: colors.text, borderRadius: 4, overflow: 'hidden', position: 'relative' },
  img: { width: '100%', height: '100%' },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fbText: { fontFamily: fonts.display, color: colors.surface, fontSize: 11, letterSpacing: 0.3 },
  badge: { position: 'absolute', top: 2, left: 2, backgroundColor: 'rgba(26,23,20,0.6)', paddingHorizontal: 3, borderRadius: 2 },
  badgeText: { fontFamily: fonts.display, color: '#F2E6CE', fontSize: 8, letterSpacing: 0.3 },
});
