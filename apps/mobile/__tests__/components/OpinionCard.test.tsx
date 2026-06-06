import { render, screen } from '@testing-library/react-native';
import { OpinionCard } from '../../src/components/OpinionCard';
import { colors } from '../../src/theme/colors';
import type { Opinion } from '../../src/types';

const opinion = {
  id: 'o1', boardId: 'b1', userId: 'u1', username: '@kookslayer',
  text: 'Genuinely magic.', scores: { overall_rating: 5 }, tags: {},
  upvotes: 24, downvotes: 1, createdAt: new Date().toISOString(),
} as unknown as Opinion;

describe('OpinionCard', () => {
  it('renders on the calm card surface and shows the text', () => {
    render(<OpinionCard opinion={opinion} />);
    expect(screen.getByText('Genuinely magic.')).toBeTruthy();
    const card = screen.getByTestId('opinion-card');
    expect(card.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: colors.surfaceCard })]),
    );
  });
});
