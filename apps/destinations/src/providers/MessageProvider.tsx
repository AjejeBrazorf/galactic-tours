'use client'

import { APP_CONFIG } from '@/appConfig'

import type { MessageBus } from '@galactic-tours/messaging'
import {
  MessageProvider as MessagingPackageProvider,
  useMessage as useMessagingMessage,
} from '@galactic-tours/messaging'
import { useEffect, useRef, useState } from 'react'

/**
 * Destinations app MessageProvider
 *
 * This component wraps the messaging package's MessageProvider to provide
 * destinations-specific configuration.
 */
export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <MessagingPackageProvider
      appId='destinations'
      debug={APP_CONFIG.DEBUG}
      allowedOrigins={APP_CONFIG.getAllowedOrigins()}>
      {children}
    </MessagingPackageProvider>
  )
}

const noopMessageBus: MessageBus = {
  send: () => {},
  subscribe: () => () => {},
  broadcast: () => {},
}
export const useMessage = () => {
  const [isMounted, setIsMounted] = useState(false)
  const messageBusRef = useRef<MessageBus | null>(null)

  useEffect(() => {
    try {
      messageBusRef.current = useMessagingMessage()
    } catch (error) {
      console.warn('Failed to access MessageBus directly, using fallback')
      messageBusRef.current = noopMessageBus
    }

    setIsMounted(true)
  }, [])

  if (!isMounted || !messageBusRef.current) {
    return noopMessageBus
  }

  return messageBusRef.current
}
