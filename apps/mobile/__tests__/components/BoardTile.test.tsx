import { render, screen } from '@testing-library/react-native';
import { BoardTile } from '../../src/components/BoardTile';
import type { Board } from '../../src/types';

const base: Board = {
  id: '1', name: 'Ghost', shaper: 'Pyzel', shaperId: 's1', type: 'SHORTIE' as Board['type'],
  rating: 5, opinionCount: 12,
} as Board;

describe('BoardTile', () => {
  it('renders the board photo when imageUrl is present', () => {
    render(<BoardTile board={{ ...base, imageUrl: 'https://x/board.jpg' }} />);
    const img = screen.getByTestId('board-image');
    const src = Array.isArray(img.props.source) ? img.props.source[0] : img.props.source;
    expect(src).toMatchObject({ uri: 'https://x/board.jpg' });
  });

  it('falls back to the board initial when imageUrl is missing', () => {
    render(<BoardTile board={{ ...base, imageUrl: undefined }} />);
    expect(screen.getByText('G')).toBeTruthy();
    expect(screen.queryByTestId('board-image')).toBeNull();
  });
});
