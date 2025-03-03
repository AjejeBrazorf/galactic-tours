'use client'

import {
  createMessageBus,
  MessageBus,
  MessageBusContext,
} from '@galactic-tours/messaging'
import { useContext, useEffect, useState } from 'react'

const MessageContext = MessageBusContext

export const useMessage = () => {
  const messageBus = useContext<MessageBus | null>(MessageContext)
  if (!messageBus) {
    throw new Error('useMessageBus must be used within a MessageProvider')
  }
  return messageBus
}

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [messageBus, setMessageBus] = useState<MessageBus | null>(null)

  useEffect(() => {
    const bus = createMessageBus({
      appId: 'destinations',
      origin: {
        allowedOrigins: ['http://localhost:3000'],
        validateOrigin: true,
      },
    })

    setMessageBus(bus)
  }, [])

  if (!messageBus) return null

  return (
    <MessageContext.Provider value={messageBus}>
      {children}
    </MessageContext.Provider>
  )
}
