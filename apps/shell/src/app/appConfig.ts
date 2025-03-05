const DESTINATION_APP_URL =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DESTINATION_APP_URL
    ? process.env.NEXT_PUBLIC_DESTINATION_APP_URL
    : 'http://localhost:5173'

const SHELL_APP_URL =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SHELL_APP_URL
    ? process.env.NEXT_PUBLIC_SHELL_APP_URL
    : 'http://localhost:3000'

export const APP_CONFIG = {
  DESTINATION_APP_URL,
  SHELL_APP_URL,

  features: {
    destinations: {
      map: {
        enabled: true,
        iframe: {
          src: `${DESTINATION_APP_URL}/map`,
          title: 'Destinations Map',
        },
      },
      list: {
        enabled: true,
        iframe: {
          src: `${DESTINATION_APP_URL}/list`,
          title: 'Destinations List',
        },
      },
    },
  },

  getAllowedOrigins: () => {
    if (process.env.NODE_ENV === 'development') {
      return [SHELL_APP_URL, DESTINATION_APP_URL]
    }

    return [SHELL_APP_URL, DESTINATION_APP_URL, '*']
  },
}
