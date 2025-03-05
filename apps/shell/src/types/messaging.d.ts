declare module '@galactic-tours/messaging' {
  // Re-export everything from the original module
  export * from '@galactic-tours/messaging'

  // Message constants
  export const DESTINATION_MESSAGES: {
    SELECTED: string
    DETAILS_REQUESTED: string
    DETAILS_RESPONSE: string
  }

  export const SYSTEM_MESSAGES: {
    APP_READY: string
    CONFIG_UPDATED: string
    ERROR: string
  }

  // Types
  export interface Destination {
    id: string
    name: string
    description?: string
    [key: string]: unknown
  }

  export interface DestinationSelectedPayload {
    destination: Destination | null
  }

  export interface DestinationDetailsRequestedPayload {
    destinationId: string
  }

  export interface DestinationDetailsResponsePayload {
    destination: Destination
  }

  export interface SystemReadyPayload {
    appId: string
    timestamp: number
  }

  // Providers
  export const DestinationProvider: React.FC<{
    children: React.ReactNode
    initialDestinations?: Destination[]
    enableRelay?: boolean // Whether this provider should relay messages to other instances
  }>

  export const MessageProvider: React.FC<{
    children: React.ReactNode
    appId: string
    debug?: boolean
    allowedOrigins?: string[]
  }>

  export const SystemProvider: React.FC<{
    children: React.ReactNode
  }>

  // Hooks
  export function useDestinations(): {
    activeDestination: Destination | null
    destinations: Destination[]
    loading: boolean
    selectDestination: (destinationId: string | null) => void
    requestDestinationDetails: (destinationId: string) => void
    provideDestinationDetails: (destination: Destination) => void
    [key: string]: unknown
  }

  export function useMessage(): unknown
  export function useSystem(): unknown

  // Core functionality
  export function createMessageBus(options: unknown): unknown
  export function createTypedMessageSender<T>(
    bus: unknown,
    messageType: string
  ): (payload: T) => void
  export function createTypedMessageSubscriber<T>(
    bus: unknown,
    messageType: string
  ): (callback: (payload: T) => void) => () => void

  // Core types
  export interface MessageBus {
    send: (type: string, data: unknown) => void
    subscribe: (type: string, callback: (data: unknown) => void) => () => void
    broadcast: (type: string, data: unknown) => void
  }

  export interface MessageBusOptions {
    appId: string
    debug?: boolean
    allowedOrigins?: string[]
  }

  export type MessageSubscriber = (data: unknown, source?: unknown) => void
}
