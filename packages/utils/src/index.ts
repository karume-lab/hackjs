/**
 * Returns the base URL for the application.
 * Checks environment variables for Expo and Next.js, then falls back to
 * the browser's window.location.origin, and finally defaults to localhost:3000.
 */
export function getBaseUrl() {
  if (process.env.EXPO_PUBLIC_APP_URL) return process.env.EXPO_PUBLIC_APP_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "http://localhost:3000";
}
