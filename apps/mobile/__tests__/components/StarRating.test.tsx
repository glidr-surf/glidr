import { render, screen, fireEvent } from '@testing-library/react-native';
import { StarRating } from '../../src/components/StarRating';

describe('StarRating', () => {
  it('calls onChange with the tapped star value', () => {
    const onChange = jest.fn();
    render(<StarRating value={0} onChange={onChange} />);
    fireEvent.press(screen.getByLabelText('Rate 4 of 5'));
    expect(onChange).toHaveBeenCalledWith(4);
  });
});
