import { render, screen } from '@testing-library/react-native';
import { GlidrMark } from '../../src/components/GlidrMark';

describe('GlidrMark', () => {
  it('renders the G glyph', () => {
    render(<GlidrMark size={40} testID="mark" />);
    expect(screen.getByText('G')).toBeTruthy();
    expect(screen.getByTestId('mark')).toBeTruthy();
  });
});
