import { createContext, ReactNode, useContext } from 'react'
import { MessageBus } from '../core/message-bus'

export const MessageBusContext = createContext<MessageBus | null>(null)

export interface MessageBusProviderProps {
  messageBus: MessageBus
  children: ReactNode
}

export function MessageBusProvider({
  messageBus,
  children,
}: MessageBusProviderProps) {
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
