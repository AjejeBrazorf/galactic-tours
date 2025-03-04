/**
 * Message Type Map
 *
 * Unified type mapping for all message types to their payload types.
 * This provides a central registry for type checking while keeping
 * domain-specific types in their own files.
 */

import {
  DESTINATION_MESSAGES,
  DestinationPayloadMap,
} from './destination-types'
import { SYSTEM_MESSAGES, SystemPayloadMap } from './system-types'

/**
 * Combined payload map for all message types
 * This merges all domain-specific payload maps into a single unified type map
 */
export type MessagePayloadMap = DestinationPayloadMap & SystemPayloadMap

/**
 * Helper type to extract the payload type for a given message type.
 * Usage: PayloadType<'system.app.ready'> will resolve to SystemReadyPayload
 */
export type PayloadType<T extends string> = T extends keyof MessagePayloadMap
  ? MessagePayloadMap[T]
  : never

/**
 * Helper type to get the message type for a given payload type
 * This is a reverse lookup of the PayloadType
 */
export type MessageTypeForPayload<P> = {
  [K in keyof MessagePayloadMap]: MessagePayloadMap[K] extends P ? K : never
}[keyof MessagePayloadMap]

/**
 * Type guard to check if a given string is a valid message type
 */
export function isValidMessageType(
  type: string
): type is keyof MessagePayloadMap {
  return (
    type in
    {
      ...Object.values(DESTINATION_MESSAGES),
      ...Object.values(SYSTEM_MESSAGES),
    }
  )
}
