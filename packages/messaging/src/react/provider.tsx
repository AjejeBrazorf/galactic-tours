import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

import type { MessageBus } from '../core/message-bus'

export const MessageBusContext = createContext<MessageBus | null>(null)

export interface MessageBusProviderProps {
  messageBus: MessageBus
  children: ReactNode
}

export const MessageBusProvider = ({
  messageBus,
  children,
}: MessageBusProviderProps) => {
  return (
    <MessageBusContext.Provider value={messageBus}>
      {children}
    </MessageBusContext.Provider>
  )
}

export function useMessageBus(): MessageBus {
  const messageBus = useContext(MessageBusContext)
  if (!messageBus) {
    throw new Error('useMessageBus must be used within a MessageBusProvider')
  }
  return messageBus
}
