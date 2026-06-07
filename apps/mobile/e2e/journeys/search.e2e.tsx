import { screen, waitFor } from '@testing-library/react-native';
import { renderApp } from '../support/renderApp';

describe('search', () => {
  it('filters boards by query', async () => {
    const { user } = renderApp('/');
    // Open search from the browse header magnifier.
    await waitFor(() => expect(screen.getByTestId('header-search')).toBeTruthy());
    await user.press(screen.getByTestId('header-search'));
    await waitFor(() => expect(screen.getByTestId('search-input')).toBeTruthy());

    await user.type(screen.getByTestId('search-input'), 'FLAT');

    // Matching board appears; a real seeded board that doesn't match is excluded.
    await waitFor(() => expect(screen.getByText('FLAT TRACKER')).toBeTruthy());
    expect(screen.queryByText('SPROUT')).toBeNull();
  });
});
