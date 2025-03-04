/**
 * Message Bus
 *
 * Core implementation of the message bus used for cross-microfrontend communication.
 * Handles message sending, receiving, and subscription management.
 */

// Basic subscription type
export type MessageSubscriber = (data: any, source?: MessageEventSource) => void

// Message bus interface
export interface MessageBus {
  send: (type: string, data: any) => void
  subscribe: (type: string, callback: MessageSubscriber) => () => void
  broadcast: (type: string, data: any) => void
}

// Options for creating a message bus
export interface MessageBusOptions {
  appId: string
  debug?: boolean
  allowedOrigins?: string[]
}

/**
 * Creates a message bus instance for cross-microfrontend communication
 */
export function createMessageBus(options: MessageBusOptions): MessageBus {
  // Create empty subscriptions map
  const subscriptions: Map<string, Set<MessageSubscriber>> = new Map()

  // Check for SSR (Server-Side Rendering)
  const isServer = typeof window === 'undefined'

  // If we're in a server environment, return a no-op message bus
  if (isServer) {
    return {
      send: (type: string, data: any) => {},
      subscribe: (type: string, callback: MessageSubscriber) => () => {},
      broadcast: (type: string, data: any) => {},
    }
  }

  // Client-side implementation continues here
  const { appId, debug = false, allowedOrigins } = options

  // Internal logging function
  const log = (message: string, ...args: any[]) => {
    if (debug) {
      console.log(`[MessageBus:${appId}] ${message}`, ...args)
    }
  }

  // Handle incoming messages
  const handleMessage = (event: MessageEvent) => {
    // Validate origin
    if (!isValidOrigin(event.origin)) {
      log(`Ignoring message from unauthorized origin: ${event.origin}`)
      return
    }

    // Parse message data
    try {
      const { type, data, sourceAppId } = event.data

      // Ignore our own messages to prevent loops
      if (sourceAppId === appId) {
        return
      }

      log(`Received message: ${type}`, data)

      // Notify subscribers
      const handlers = subscriptions.get(type)
      if (handlers) {
        handlers.forEach((callback) => {
          try {
            const source = event.source || undefined
            callback(data, source)
          } catch (error) {
            console.error(
              `[MessageBus:${appId}] Error in message handler:`,
              error
            )
          }
        })
      }
    } catch (error) {
      // Not a valid message or error in processing
      log('Error processing message', error)
    }
  }

  // Check if origin is allowed
  const isValidOrigin = (origin: string): boolean => {
    // Always allow same origin
    if (origin === window.location.origin) {
      return true
    }

    // In development, allow all localhost origins
    if (
      process.env.NODE_ENV === 'development' &&
      (origin.startsWith('http://localhost:') ||
        origin.startsWith('https://localhost:'))
    ) {
      return true
    }

    // Check against allowed origins
    const isAllowed =
      options.allowedOrigins?.some((allowed) => {
        if (allowed === '*') {
          return true // Allow all origins (use with caution)
        }
        return origin === allowed
      }) ?? false

    // Log detailed information about failed origin validation in non-production
    if (!isAllowed && debug) {
      console.warn(`[MessageBus:${appId}] Origin validation failed:`, {
        receivedFrom: origin,
        allowedOrigins: options.allowedOrigins,
        locationOrigin: window.location.origin,
      })
    }

    return isAllowed
  }

  // Set up event listener
  window.addEventListener('message', handleMessage)

  // Send a message to other windows/frames
  const send = (type: string, data: any) => {
    const message = {
      type,
      data,
      sourceAppId: appId,
      timestamp: Date.now(),
    }

    log(`Sending message: ${type}`, data)

    // Send to parent if we're in an iframe
    if (window.parent !== window) {
      window.parent.postMessage(message, '*')
    }

    // Send to all child iframes
    Array.from(document.querySelectorAll('iframe')).forEach((iframe) => {
      try {
        iframe.contentWindow?.postMessage(message, '*')
      } catch (error) {
        log(`Error sending to iframe:`, error)
      }
    })
  }

  // Send a message to a specific target
  const sendTo = (target: Window, type: string, data: any) => {
    const message = {
      type,
      data,
      sourceAppId: appId,
      timestamp: Date.now(),
    }

    log(`Sending targeted message: ${type}`, data)

    try {
      target.postMessage(message, '*')
    } catch (error) {
      log('Error sending targeted message:', error)
    }
  }

  // Broadcast a message to all windows
  const broadcast = (type: string, data: any) => {
    send(type, data)

    // Also handle locally for internal subscribers
    const handlers = subscriptions.get(type)
    if (handlers) {
      handlers.forEach((callback) => {
        try {
          callback(data)
        } catch (error) {
          console.error(
            `[MessageBus:${appId}] Error in local message handler:`,
            error
          )
        }
      })
    }
  }

  // Subscribe to a message type
  const subscribe = (
    type: string,
    callback: MessageSubscriber
  ): (() => void) => {
    if (!subscriptions.has(type)) {
      subscriptions.set(type, new Set())
    }

    const handlers = subscriptions.get(type)!
    handlers.add(callback)

    log(`Subscribed to message: ${type}`)

    // Return unsubscribe function
    return () => {
      const handlers = subscriptions.get(type)
      if (handlers) {
        handlers.delete(callback)
        if (handlers.size === 0) {
          subscriptions.delete(type)
        }
      }
      log(`Unsubscribed from message: ${type}`)
    }
  }

  // Cleanup function
  const destroy = () => {
    window.removeEventListener('message', handleMessage)
    subscriptions.clear()
    log('Message bus destroyed')
  }

  // Return public API
  return {
    send,
    subscribe,
    broadcast,
  }
}

/**
 * Creates a strongly-typed message sender for a specific message type.
 * This provides type safety when sending messages.
 */
export function createTypedMessageSender<T>(
  bus: MessageBus,
  messageType: string
) {
  return (payload: T) => {
    bus.send(messageType, payload)
  }
}

/**
 * Creates a strongly-typed message subscriber for a specific message type.
 * This provides type safety when handling message payloads.
 */
export function createTypedMessageSubscriber<T>(
  bus: MessageBus,
  messageType: string
) {
  return (callback: (payload: T) => void) => {
    return bus.subscribe(messageType, (data) => {
      callback(data as T)
    })
  }
}
