import { renderRouter } from 'expo-router/testing-library';
import { userEvent } from '@testing-library/react-native';

// Mount the REAL app/ route tree. renderRouter's first arg is a
// MockContextConfig; a directory string (relative to the mobile root) loads the
// real routes via require.context.
export function renderApp(initialUrl = '/') {
  const utils = renderRouter('./app', { initialUrl });
  const user = userEvent.setup();
  return { ...utils, user };
}
