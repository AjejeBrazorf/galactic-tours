/**
 * Messaging Package
 *
 * This is the main entry point for the messaging package.
 * It exports all the necessary components for cross-microfrontend communication.
 */

// Export constants
export * from './constants/message-payloads'
export * from './constants/message-types'
export * from './constants/type-map'

// Export providers
export * from './providers/destination-provider'
export * from './providers/message-provider'
export * from './providers/system-provider'

// Export core message bus functionality
export {
  createMessageBus,
  createTypedMessageSender,
  createTypedMessageSubscriber,
} from './core/message-bus'

// Export types
export type {
  MessageBus,
  MessageBusOptions,
  MessageSubscriber,
} from './core/message-bus'
