import { View, StyleSheet } from 'react-native';
import { GText } from './GText';
import { boardTypeColors } from '../theme/boardTypes';
import { colors } from '../theme/colors';
import type { BoardType } from '../types';

interface BoardTypeTagProps {
  type: BoardType;
  size?: 'sm' | 'md';
}

export function BoardTypeTag({ type, size = 'sm' }: BoardTypeTagProps) {
  const bgColor = boardTypeColors[type] ?? colors.textMid;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }, size === 'md' && styles.md]}>
      <GText variant="caption" color={colors.white}>
        {type}
      </GText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    alignSelf: 'flex-start',
  },
  md: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
});
