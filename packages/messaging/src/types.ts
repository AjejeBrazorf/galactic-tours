/**
 * Origin configuration for security
 */
export interface OriginConfig {
  /** Allowed origins for communication */
  allowedOrigins: string[]
  /** Whether to validate origins (recommended to be true in production) */
  validateOrigin: boolean
}

/**
 * Direction of message flow
 */
export enum MessageDirection {
  /** Parent to child iframe */
  PARENT_TO_CHILD = 'PARENT_TO_CHILD',
  /** Child iframe to parent */
  CHILD_TO_PARENT = 'CHILD_TO_PARENT',
  /** Between child iframes (via parent) */
  CHILD_TO_CHILD = 'CHILD_TO_CHILD',
}

/**
 * Base message interface that all messages should extend
 */
export interface BaseMessage {
  /** Unique identifier for the message */
  id: string
  /** Type of the message, used for routing */
  type: string
  /** Timestamp when the message was created */
  timestamp: number
  /** Source identifier (app name or ID) */
  source: string
  /** Optional target identifier for specific routing */
  target?: string
  /** Direction of the message */
  direction: MessageDirection
}

/**
 * Message with payload
 */
export interface Message<T = unknown> extends BaseMessage {
  /** Payload of the message */
  payload: T
}

/**
 * Message handler function type
 */
export type MessageHandler<T = unknown> = (message: Message<T>) => void

/**
 * Error message interface
 */
export interface ErrorMessage extends BaseMessage {
  /** Error code */
  code: string
  /** Error message */
  message: string
  /** Original message that caused the error */
  originalMessage?: BaseMessage
}

/**
 * Message bus options
 */
export interface MessageBusOptions {
  /** App identifier used as source in sent messages */
  appId: string
  /** Origin configuration for security */
  origin?: OriginConfig
  /** Whether to enable debug mode with console logging */
  debug?: boolean
  /** Default timeout for request-response patterns (in ms) */
  defaultTimeout?: number
  /** Maximum message size in bytes (default: 1MB) */
  maxMessageSize?: number
}

/**
 * Message subscription options
 */
export interface SubscriptionOptions {
  /** Whether to receive messages only once */
  once?: boolean
  /** Custom filter function */
  filter?: (message: BaseMessage) => boolean
}

/**
 * Request-response message pattern
 */
export interface RequestMessage<T = unknown> extends Message<T> {
  /** Correlation ID for matching requests with responses */
  correlationId: string
}

/**
 * Response message for request-response pattern
 */
export interface ResponseMessage<T = unknown> extends Message<T> {
  /** Correlation ID matching the original request */
  correlationId: string
  /** Whether the request was successful */
  success: boolean
  /** Error information if the request failed */
  error?: {
    code: string
    message: string
  }
}

/**
 * Type guard to check if a message is an error message
 */
export function isErrorMessage(message: BaseMessage): message is ErrorMessage {
  return (
    (message as ErrorMessage).code !== undefined &&
    (message as ErrorMessage).message !== undefined
  )
}

/**
 * Type guard to check if a message is a request message
 */
export function isRequestMessage<T = unknown>(
  message: BaseMessage
): message is RequestMessage<T> {
  return (message as RequestMessage).correlationId !== undefined
}

/**
 * Type guard to check if a message is a response message
 */
export function isResponseMessage<T = unknown>(
  message: BaseMessage
): message is ResponseMessage<T> {
  return (
    (message as ResponseMessage).correlationId !== undefined &&
    (message as ResponseMessage).success !== undefined
  )
}

/**
 * Create a typed message creator for specific message types
 */
export function createMessageType<T>() {
  return {
    is: (message: BaseMessage): message is Message<T> => {
      return true // This should be overridden with proper type checking logic
    },
  }
}
