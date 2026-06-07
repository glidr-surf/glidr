import { render, screen } from '@testing-library/react-native';
import { BoardThumb } from '../../src/components/BoardThumb';
import type { Board } from '../../src/types';

const base = { id: '1', name: 'X', shaper: 'Y', type: 'MID' } as Board;

describe('BoardThumb', () => {
  it('renders photo when imageUrl present', () => {
    render(<BoardThumb board={{ ...base, imageUrl: 'https://x/b.jpg' } as Board} />);
    expect(screen.getByTestId('board-thumb-img')).toBeTruthy();
  });
  it('falls back to type when no photo', () => {
    render(<BoardThumb board={{ ...base, imageUrl: undefined } as Board} />);
    expect(screen.getByText('MID')).toBeTruthy();
  });
});
