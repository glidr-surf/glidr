import { FlatList, StyleSheet } from 'react-native';
import { BoardTile } from './BoardTile';
import type { Board } from '../types';

interface BoardGridProps {
  boards: Board[];
  ListHeaderComponent?: React.ReactElement;
}

export function BoardGrid({ boards, ListHeaderComponent }: BoardGridProps) {
  return (
    <FlatList
      data={boards}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <BoardTile board={item} />}
      numColumns={3}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  row: {
    gap: 2,
  },
});
