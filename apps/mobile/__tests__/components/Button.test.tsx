import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/components/Button';

describe('Button', () => {
  it('renders its label', () => {
    render(<Button label="RATE THIS BOARD" onPress={() => {}} />);
    expect(screen.getByText('RATE THIS BOARD')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<Button label="GO" onPress={onPress} />);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('has a >=56px min tap height', () => {
    render(<Button label="GO" onPress={() => {}} />);
    const btn = screen.getByRole('button');
    expect(btn.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ minHeight: 56 })]),
    );
  });
});
