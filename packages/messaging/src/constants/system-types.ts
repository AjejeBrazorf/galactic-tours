/**
 * System Types
 *
 * Types, constants, and payload mappings for system-related messaging.
 * Centralizes all system-specific type definitions in one place.
 */

// Message type constants
export const SYSTEM_MESSAGES = {
  APP_READY: 'system.app.ready',
  ERROR: 'system.error',
  CONFIG_UPDATED: 'system.config.updated',
} as const

// Type for all system message types
export type SystemMessageType =
  (typeof SYSTEM_MESSAGES)[keyof typeof SYSTEM_MESSAGES]

// System payload interfaces
export interface SystemReadyPayload {
  appId: string
  timestamp: number
}

export interface SystemErrorPayload {
  code: string
  message: string
  details?: any
  source?: string
  timestamp: number
}

export interface SystemConfigPayload {
  config: Record<string, any>
  source: string
  timestamp: number
}

// Payload mapping for system messages
export type SystemPayloadMap = {
  'system.app.ready': SystemReadyPayload
  'system.error': SystemErrorPayload
  'system.config.updated': SystemConfigPayload
}
