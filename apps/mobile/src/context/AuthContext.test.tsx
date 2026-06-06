import { renderHook, act, waitFor } from '@testing-library/react-native';
import React from 'react';

const mockGetSession = jest.fn();
const mockOnAuthStateChange = jest.fn((..._a: unknown[]) => ({ data: { subscription: { unsubscribe: jest.fn() } } }));
const mockSignInWithOtp = jest.fn();
const mockVerifyOtp = jest.fn();
const mockSignOut = jest.fn();

jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: (...a: unknown[]) => mockGetSession(...a),
      onAuthStateChange: (...a: unknown[]) => mockOnAuthStateChange(...a),
      signInWithOtp: (...a: unknown[]) => mockSignInWithOtp(...a),
      verifyOtp: (...a: unknown[]) => mockVerifyOtp(...a),
      signOut: (...a: unknown[]) => mockSignOut(...a),
    },
  },
}));

const mockGetProfile = jest.fn();
jest.mock('@glidr/data', () => ({ getProfile: (...a: unknown[]) => mockGetProfile(...a) }));

import { AuthProvider, useAuth } from './AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

beforeEach(() => {
  jest.clearAllMocks();
  mockGetSession.mockResolvedValue({ data: { session: null } });
});

it('starts logged out and finishes loading', async () => {
  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.user).toBeNull();
  expect(result.current.isAuthenticated).toBe(false);
});

it('restores an existing session and loads the profile', async () => {
  mockGetSession.mockResolvedValue({ data: { session: { user: { id: 'u1' } } } });
  mockGetProfile.mockResolvedValue({ id: 'u1', username: 'SaltyDawg' });

  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.user?.username).toBe('SaltyDawg'));
  expect(result.current.isAuthenticated).toBe(true);
});

it('verifyCode signals needsUsername when no profile exists', async () => {
  mockVerifyOtp.mockResolvedValue({ data: { session: { user: { id: 'new' } } }, error: null });
  mockGetProfile.mockResolvedValue(null);

  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  let needsUsername = false;
  await act(async () => {
    needsUsername = await result.current.verifyCode('a@b.com', '123456');
  });
  expect(needsUsername).toBe(true);
});

it('sendCode calls signInWithOtp with shouldCreateUser', async () => {
  mockSignInWithOtp.mockResolvedValue({ error: null });
  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  await act(async () => { await result.current.sendCode('a@b.com'); });
  expect(mockSignInWithOtp).toHaveBeenCalledWith({
    email: 'a@b.com',
    options: { shouldCreateUser: true },
  });
});
