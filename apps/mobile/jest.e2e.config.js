const base = require('./jest.config');

module.exports = {
  ...base,
  globalSetup: '<rootDir>/e2e/support/env.ts',
  // supabase-env runs per-worker (before the module graph) so the supabase
  // singleton sees EXPO_PUBLIC_* at import; globalSetup's env doesn't propagate
  // to workers. jest.setup runs after the test env is set up (native mocks).
  setupFiles: ['<rootDir>/e2e/support/supabase-env.ts'],
  setupFilesAfterEnv: ['<rootDir>/e2e/support/jest.setup.ts'],
  testMatch: ['<rootDir>/e2e/journeys/**/*.e2e.tsx'],
  testTimeout: 30000,
};
