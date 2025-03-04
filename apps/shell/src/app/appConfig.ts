/**
 * Application configuration that handles environment variables
 * in a way that's compatible with both server and client rendering.
 *
 * For Next.js, we need to prefix environment variables with NEXT_PUBLIC_
 * to make them available on the client side.
 */
export const APP_CONFIG = {
  DESTINATION_APP_URL:
    typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_DESTINATION_APP_URL
      ? process.env.NEXT_PUBLIC_DESTINATION_APP_URL
      : 'http://localhost:5173',
  SHELL_APP_URL:
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SHELL_APP_URL
      ? process.env.NEXT_PUBLIC_SHELL_APP_URL
      : 'http://localhost:3000',

  getAllowedOrigins: () => {
    if (process.env.NODE_ENV === 'development') {
      return [APP_CONFIG.SHELL_APP_URL, APP_CONFIG.DESTINATION_APP_URL]
    }

    return [
      // Include your exact production domains
      APP_CONFIG.SHELL_APP_URL,
      APP_CONFIG.DESTINATION_APP_URL,
      '*',
    ]
  },
}
