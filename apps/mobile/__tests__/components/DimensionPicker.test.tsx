import { render, screen } from '@testing-library/react-native';
import { DimensionPicker } from '../../src/components/DimensionPicker';

describe('DimensionPicker', () => {
  it('shows the label and placeholder when no value', () => {
    render(<DimensionPicker kind="width" value={null} onChange={() => {}} />);
    expect(screen.getByText('WIDTH')).toBeTruthy();
    expect(screen.getByText('Set ▾')).toBeTruthy();
  });
  it('shows the formatted value when set', () => {
    render(<DimensionPicker kind="width" value={20.25} onChange={() => {}} />);
    expect(screen.getByText('20¼" ▾')).toBeTruthy();
  });
});
