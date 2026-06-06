type AppRouter = ReturnType<typeof import('expo-router').useRouter>;

/**
 * Go back if there is somewhere to go back to, otherwise fall back to Home.
 * Prevents "The action 'GO_BACK' was not handled" when a screen is the entry
 * point (deep link, notification, or app-open-to-screen).
 */
export function navBack(router: AppRouter): void {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}
