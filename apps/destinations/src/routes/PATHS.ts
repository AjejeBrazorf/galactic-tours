export const PATHS = {
  HOME: '/',
  MAP: 'map',
  LIST: 'list',
  DETAIL: 'detail',
} as const

export type PathsType = typeof PATHS
export type PathKeys = keyof PathsType

/**
 * Helper function to create a URL for the detail view with a destination ID
 * @param destinationId The ID of the destination to view
 * @returns The URL for the destination detail page
 */
export function getDetailPath(destinationId: string): string {
  return `${PATHS.DETAIL}?id=${encodeURIComponent(destinationId)}`
}
