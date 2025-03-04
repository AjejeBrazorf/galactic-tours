'use client'

import { APP_CONFIG } from '@/appConfig'
import {
  MessageBus,
  MessageProvider as MessagingPackageProvider,
  useMessage as useMessagingMessage,
} from '@galactic-tours/messaging'
import { useEffect, useRef, useState } from 'react'

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <MessagingPackageProvider
      appId='destinations'
      debug={process.env.NODE_ENV === 'development'}
      allowedOrigins={[
        APP_CONFIG.SHELL_APP_URL,
        APP_CONFIG.DESTINATION_APP_URL,
      ]}>
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
