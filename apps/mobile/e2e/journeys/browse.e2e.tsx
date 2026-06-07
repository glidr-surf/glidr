import { screen, waitFor } from '@testing-library/react-native';
import { renderApp } from '../support/renderApp';
import { FLAT_TRACKER } from '../support/fixtures';

describe('browse → board detail', () => {
  it('renders seeded boards and navigates to detail', async () => {
    const { user } = renderApp('/');
    // Real DB round-trip (getBoards aggregates opinions) takes ~2-3s — well over
    // waitFor's 1000ms default, so bump the timeout for data-backed assertions.
    await waitFor(() => expect(screen.getByText('FLAT TRACKER')).toBeTruthy(), { timeout: 15000 });
    await user.press(screen.getByTestId(`board-tile-${FLAT_TRACKER}`));
    await waitFor(() => expect(screen.getByText('CHRISTENSON')).toBeTruthy(), { timeout: 15000 });
  });
});
