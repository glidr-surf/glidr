import { screen, waitFor } from '@testing-library/react-native';
import { renderApp } from '../support/renderApp';
import { FLAT_TRACKER } from '../support/fixtures';

describe('browse → board detail', () => {
  it('renders seeded boards and navigates to detail', async () => {
    const { user } = renderApp('/');
    // Real DB round-trips run ~2-3s; the global asyncUtilTimeout (jest.setup.ts) covers this.
    await waitFor(() => expect(screen.getByText('FLAT TRACKER')).toBeTruthy());
    await user.press(screen.getByTestId(`board-tile-${FLAT_TRACKER}`));
    await waitFor(() => expect(screen.getByText('CHRISTENSON')).toBeTruthy());
  });
});
