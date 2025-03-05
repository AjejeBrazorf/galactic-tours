export const PATHS = {
  HOME: '/',
  MAP: '/map',
  LIST: '/list',
} as const

export type PathsType = typeof PATHS
export type PathKeys = keyof PathsType
