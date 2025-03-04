/**
 * Destination Types
 *
 * Types, constants, and payload mappings for destination-related messaging.
 * Centralizes all destination-specific type definitions in one place.
 */

// Base entity interface
export interface Entity {
  id: string
}

// Message type constants
export const DESTINATION_MESSAGES = {
  SELECTED: 'destination.selected',
  DETAILS_REQUESTED: 'destination.details.requested',
  DETAILS_RESPONSE: 'destination.details.response',
} as const

// Type for all destination message types
export type DestinationMessageType =
  (typeof DESTINATION_MESSAGES)[keyof typeof DESTINATION_MESSAGES]

/**
 * Destination entity
 */
export interface Destination extends Entity {
  id: string
  name: string
  description: string
  emission: number
  radius: number
  position: [number, number, number]
  texture: {
    color: string
    bump?: string
  }
  color: string
  tags?: string[]
  price?: number
  distance?: number
}

// Destination payload interfaces
export interface DestinationSelectedPayload {
  destination: Destination | null
}

export interface DestinationDetailsRequestedPayload {
  destinationId: string | null
}

export interface DestinationDetailsResponsePayload {
  destination: Destination | null
}

// Payload mapping for destination messages
export type DestinationPayloadMap = {
  'destination.selected': DestinationSelectedPayload
  'destination.details.requested': DestinationDetailsRequestedPayload
  'destination.details.response': DestinationDetailsResponsePayload
}
