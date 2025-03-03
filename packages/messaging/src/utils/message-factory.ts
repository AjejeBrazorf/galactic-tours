import { BaseMessage, Message, MessageDirection } from '../types'

export interface MessageTypeDefinition<T> {
  type: string
  is: (message: BaseMessage) => message is Message<T>
  create: (
    payload: T,
    options: {
      source: string
      target?: string
      direction?: MessageDirection
      id?: string
    }
  ) => Message<T>
}

/**
 * Create a typed message definition
 * @param type Message type identifier
 * @returns A message type definition with type guards and creation functions
 */
export function defineMessageType<T>(type: string): MessageTypeDefinition<T> {
  return {
    type,

    is: (message: BaseMessage): message is Message<T> => {
      return message.type === type && 'payload' in message
    },

    create: (
      payload: T,
      options: {
        source: string
        target?: string
        direction?: MessageDirection
        id?: string
      }
    ): Message<T> => {
      return {
        id: options.id || generateId(),
        type,
        timestamp: Date.now(),
        source: options.source,
        target: options.target,
        direction: options.direction || MessageDirection.PARENT_TO_CHILD,
        payload,
      }
    },
  }
}

/**
 * Create a message namespace to avoid type collisions
 * @param namespace Namespace prefix for message types
 * @returns A function to create namespaced message types
 */
export function createMessageNamespace(namespace: string) {
  return {
    defineMessageType: <T>(type: string): MessageTypeDefinition<T> => {
      return defineMessageType<T>(`${namespace}/${type}`)
    },
  }
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  )
}
