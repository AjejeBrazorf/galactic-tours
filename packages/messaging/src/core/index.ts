import { MessageBusOptions } from '../types'
import { MessageBus } from './message-bus'

/**
 * Create a message bus instance
 * @param options Configuration options for the message bus
 * @returns A new MessageBus instance
 */
export function createMessageBus(options: MessageBusOptions): MessageBus {
  if (!window) {
    throw new Error('MessageBus must be created in a browser environment')
  }
  return new MessageBus(options)
}

export * from '../types'
export { MessageBus } from './message-bus'
