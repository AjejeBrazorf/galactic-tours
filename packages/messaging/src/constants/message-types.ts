/**
 * Message Types
 *
 * This file re-exports message type constants from domain-specific files.
 * It provides a centralized way to access all message types while maintaining
 * domain separation for maintainability.
 */

import { DESTINATION_MESSAGES } from './destination-types'
import { SYSTEM_MESSAGES } from './system-types'

// Re-export domain-specific message types
export { DESTINATION_MESSAGES } from './destination-types'
export { SYSTEM_MESSAGES } from './system-types'

// Application IDs
export const APP_IDS = {
  SHELL: 'shell',
  DESTINATIONS: 'destinations',
}

// A complete map of all message types, grouped by domain
export const MESSAGE_TYPES = {
  DESTINATION: { ...DESTINATION_MESSAGES },
  SYSTEM: { ...SYSTEM_MESSAGES },
}
