import type { UseMessagingOptions } from './hooks'
import { useMessaging } from './hooks'
import {
  MessageBusContext,
  MessageBusProvider,
  useMessageBus,
} from './provider'

/**
 * Combined hook to access the MessageBus from context and set up messaging
 */
export function useContextMessaging(options?: UseMessagingOptions) {
  const messageBus = useMessageBus()
  return useMessaging(messageBus, options)
}

export type { UseMessagingOptions } from './hooks'
export { MessageBusContext, MessageBusProvider, useMessageBus, useMessaging }
