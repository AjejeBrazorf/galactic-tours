/**
 * Application configuration that handles environment variables
 * in a way that's compatible with both client and server rendering.
 *
 * For Vite, we need to prefix environment variables with VITE_
 * to make them available on the client side.
 */

// Determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

export const APP_CONFIG = {
  // URLs for the microfrontend applications
  SHELL_APP_URL: import.meta.env?.VITE_SHELL_APP_URL || 'http://localhost:3000',
  DESTINATION_APP_URL:
    import.meta.env?.VITE_DESTINATION_APP_URL || 'http://localhost:5173',

  // Debug mode flag
  DEBUG:
    import.meta.env?.VITE_DEBUG_MODE === 'true' ||
    import.meta.env?.MODE === 'development',

  // Get all allowed origins for messaging
  getAllowedOrigins: () => {
    // In development, rely on the environment variables
    if (import.meta.env?.MODE === 'development') {
      return [APP_CONFIG.SHELL_APP_URL, APP_CONFIG.DESTINATION_APP_URL]
    }

    // In production, include all possible domains and subdomains
    // This is the safest approach to ensure messaging works
    return [
      // Include your exact production domains
      APP_CONFIG.SHELL_APP_URL,
      APP_CONFIG.DESTINATION_APP_URL,
      // Include wildcard to ensure it works in all environments
      '*',
    ]
  },
}
