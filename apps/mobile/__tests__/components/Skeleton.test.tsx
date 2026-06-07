import { render, screen } from '@testing-library/react-native';
import { Skeleton } from '../../src/components/Skeleton';

describe('Skeleton', () => {
  it('renders a box of the given size', () => {
    render(<Skeleton testID="sk" width={100} height={40} />);
    const el = screen.getByTestId('sk');
    expect(el.props.style).toEqual(
      expect.objectContaining({ width: 100, height: 40 }),
    );
  });
});
