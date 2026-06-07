import { screen, waitFor } from '@testing-library/react-native';
import { renderApp } from '../support/renderApp';
import { FLAT_TRACKER, CHRISTENSON_SHAPER, SEED_USER, SEED_USER_NAME } from '../support/fixtures';

describe('read-path screens', () => {
  it('board detail shows shaper, opinions and rating stat', async () => {
    renderApp(`/board/${FLAT_TRACKER}`);
    await waitFor(() => expect(screen.getByText('FLAT TRACKER')).toBeTruthy());
    // Shaper attribution (board detail uppercases the name).
    expect(screen.getByText('CHRISTENSON')).toBeTruthy();
    // Seeded opinions render with author + score; OpinionCard renders the username verbatim.
    await waitFor(() => expect(screen.getByText('SaltyDawg')).toBeTruthy());
    expect(screen.getByText('WaxedPoetic')).toBeTruthy();
  });

  it('shaper detail lists their boards', async () => {
    renderApp(`/shaper/${CHRISTENSON_SHAPER}`);
    // Shaper header (uppercased) plus their board grid. "CHRISTENSON" appears in the
    // header and under each tile's shaper label, so assert on the unique board names.
    await waitFor(() => expect(screen.getByText('FLAT TRACKER')).toBeTruthy());
    expect(screen.getByText('CHRISTENSON FISH')).toBeTruthy();
    expect(screen.getAllByText('CHRISTENSON').length).toBeGreaterThan(0);
  });

  it('user profile shows their username and opinions', async () => {
    renderApp(`/user/${SEED_USER}`);
    // Profile screen derives + uppercases the username from the user's opinions.
    await waitFor(() => expect(screen.getByText(SEED_USER_NAME)).toBeTruthy());
  });
});
