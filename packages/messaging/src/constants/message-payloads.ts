/**
 * Message Payloads
 *
 * Re-exports payload type definitions from domain-specific files.
 * This provides a centralized access point for all payload types
 * while maintaining domain separation for maintainability.
 */

// Re-export destination types
export type {
  Destination,
  DestinationDetailsRequestedPayload,
  DestinationDetailsResponsePayload,
  DestinationSelectedPayload,
  Entity,
} from './destination-types'

// Re-export system types
export type {
  SystemConfigPayload,
  SystemErrorPayload,
  SystemReadyPayload,
} from './system-types'
