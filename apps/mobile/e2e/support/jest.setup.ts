// Native-edge mocks ONLY. Never mock @glidr/data, supabase, or expo-router —
// the whole point of these e2e tests is to exercise the real app + real DB.

// AsyncStorage's native module isn't present in jest; the package ships an
// official in-memory mock (the supabase singleton uses it for session storage).
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// BrandIntro is a full-screen animated overlay that never "finishes" in jest
// (no real timers / RAF), so it would cover the app forever. Stub to null.
jest.mock('../../src/components/BrandIntro', () => ({ BrandIntro: () => null }));

// Fonts never load in jest; report loaded so the root layout renders instead of
// returning null while waiting on useFonts.
jest.mock('expo-font', () => ({
  ...jest.requireActual('expo-font'),
  useFonts: () => [true],
  isLoaded: () => true,
}));

// Haptics hit native modules that don't exist in jest.
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(), notificationAsync: jest.fn(), selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {}, NotificationFeedbackType: {},
}));

// Image picker needs the native picker UI; return a deterministic fixture asset.
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false, assets: [{ uri: 'file:///fixture.jpg', width: 100, height: 100 }],
  }),
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  MediaTypeOptions: { Images: 'Images' },
}));
