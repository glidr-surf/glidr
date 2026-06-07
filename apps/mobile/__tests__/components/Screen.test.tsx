import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { colors } from '../../src/theme/colors';

describe('Screen', () => {
  it('renders children on the app bg', () => {
    render(<Screen testID="scr"><Text>hi</Text></Screen>);
    expect(screen.getByText('hi')).toBeTruthy();
    expect(screen.getByTestId('scr').props.style).toEqual(
      expect.objectContaining({ backgroundColor: colors.bg }),
    );
  });
});
