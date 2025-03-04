/**
 * Message Provider
 *
 * Core provider for cross-microfrontend communication.
 * Creates and manages the message bus used by all other providers.
 */

import React, { createContext, ReactNode, useContext, useEffect } from 'react'
import { SystemReadyPayload } from '../constants/message-payloads'
import { SYSTEM_MESSAGES } from '../constants/message-types'
import {
  createMessageBus,
  createTypedMessageSender,
  createTypedMessageSubscriber,
  MessageBus,
} from '../core/message-bus'

// Context to hold the message bus
const MessageContext = createContext<MessageBus | null>(null)

// Provider props
interface MessageProviderProps {
  children: ReactNode
  appId: string
  debug?: boolean
  allowedOrigins?: string[]
}

/**
 * Provider that creates and manages the message bus
 * This is the foundation for all other message-based providers
 */
export const MessageProvider: React.FC<MessageProviderProps> = ({
  children,
  appId,
  debug = false,
  allowedOrigins,
}) => {
  // Create message bus on mount
  const messageBus = React.useMemo(() => {
    return createMessageBus({
      appId,
      debug,
      allowedOrigins,
    })
  }, [appId, debug, allowedOrigins])

  // Broadcast app ready on mount - only runs on client side
  useEffect(() => {
    if (!messageBus) return

    // Wait a short time to ensure other apps are ready to receive
    const timer = setTimeout(() => {
      messageBus.broadcast(SYSTEM_MESSAGES.APP_READY, {
        appId,
        timestamp: Date.now(),
      } as SystemReadyPayload)
    }, 100)

    return () => clearTimeout(timer)
  }, [messageBus, appId])

  return (
    <MessageContext.Provider value={messageBus}>
      {children}
    </MessageContext.Provider>
  )
}

/**
 * Hook to access the message bus in child components
 */
export function useMessage(): MessageBus {
  const messageBus = useContext(MessageContext)
  if (!messageBus) {
    throw new Error('useMessage must be used within a MessageProvider')
  }
  return messageBus
}

/**
 * Creates a typed message sender for a specific message type.
 * This provides type safety when sending messages.
 * This is re-exported from the message-bus for convenience.
 */
export { createTypedMessageSender, createTypedMessageSubscriber }

/**
 * Create a typed message handler with automatic subscription cleanup
 */
export function useTypedMessageSubscription<T>(
  messageType: string,
  handler: (payload: T) => void,
  deps: React.DependencyList = []
) {
  const messageBus = useMessage()

  useEffect(() => {
    const subscriber = createTypedMessageSubscriber<T>(messageBus, messageType)
    const unsubscribe = subscriber(handler)

    // Cleanup subscription on unmount or deps change
    return unsubscribe
  }, [messageBus, messageType, handler, ...deps])
}
