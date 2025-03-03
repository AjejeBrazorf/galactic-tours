import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Message,
  MessageBus,
  MessageDirection,
  MessageHandler,
  SubscriptionOptions,
} from '../core/index'

/**
 * Options for the useMessaging hook
 */
export interface UseMessagingOptions {
  /** Initial subscriptions to set up */
  subscriptions?: Array<{
    type: string
    handler: MessageHandler
    options?: SubscriptionOptions
  }>
}

/**
 * Hook for using a MessageBus instance in React components
 */
export function useMessaging(
  messageBus: MessageBus,
  options?: UseMessagingOptions
) {
  // Store active subscription IDs to clean up on unmount
  const subscriptionIds = useRef<string[]>([])

  // Cache the message bus to avoid unnecessary re-subscriptions
  const messageBusRef = useRef<MessageBus>(messageBus)

  // Track whether the component is mounted
  const isMounted = useRef(true)

  // Setup initial subscriptions
  useEffect(() => {
    // Update the ref if the messageBus changes
    messageBusRef.current = messageBus

    // Set up initial subscriptions
    if (options?.subscriptions) {
      options.subscriptions.forEach(
        ({ type, handler, options: subOptions }) => {
          const subscriptionId = messageBus.subscribe(type, handler, subOptions)
          subscriptionIds.current.push(subscriptionId)
        }
      )
    }

    // Cleanup on unmount
    return () => {
      isMounted.current = false
      // Unsubscribe from all subscriptions
      subscriptionIds.current.forEach((id) => {
        messageBusRef.current.unsubscribe(id)
      })
      subscriptionIds.current = []
    }
  }, [messageBus, options])

  /**
   * Subscribe to a message type
   */
  const subscribe = useCallback(
    <T = unknown>(
      type: string,
      handler: MessageHandler<T>,
      options?: SubscriptionOptions
    ): (() => void) => {
      const subscriptionId = messageBusRef.current.subscribe(
        type,
        handler,
        options
      )
      subscriptionIds.current.push(subscriptionId)

      // Return unsubscribe function
      return () => {
        if (isMounted.current) {
          messageBusRef.current.unsubscribe(subscriptionId)
          subscriptionIds.current = subscriptionIds.current.filter(
            (id) => id !== subscriptionId
          )
        }
      }
    },
    []
  )

  /**
   * Send a message
   */
  const send = useCallback(
    <T = unknown>(
      type: string,
      payload: T,
      options?: {
        target?: string
        direction?: MessageDirection
      }
    ): void => {
      messageBusRef.current.send(type, payload, options)
    },
    []
  )

  /**
   * Request-response pattern
   */
  const request = useCallback(
    <TReq = unknown, TRes = unknown>(
      type: string,
      payload: TReq,
      options?: {
        target?: string
        timeout?: number
        direction?: MessageDirection
      }
    ): Promise<TRes> => {
      return messageBusRef.current.request<TReq, TRes>(type, payload, options)
    },
    []
  )

  /**
   * Use a specific message type with state
   */
  const useMessage = function <T = unknown>(type: string, initialState?: T) {
    const [data, setData] = useState<T | undefined>(initialState)

    useEffect(() => {
      const handler: MessageHandler<T> = (message: Message<T>) => {
        setData(message.payload)
      }

      const subscriptionId = messageBusRef.current.subscribe(type, handler)
      subscriptionIds.current.push(subscriptionId)

      return () => {
        messageBusRef.current.unsubscribe(subscriptionId)
        subscriptionIds.current = subscriptionIds.current.filter(
          (id) => id !== subscriptionId
        )
      }
    }, [type])

    return data
  }

  return {
    messageBus: messageBusRef.current,
    subscribe,
    send,
    request,
    useMessage,
  }
}
