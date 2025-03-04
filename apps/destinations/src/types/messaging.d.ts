declare module '@galactic-tours/messaging' {
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
    [key: string]: any
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
    [key: string]: any
  }

  export function useMessage(): any
  export function useSystem(): any

  // Core functionality
  export function createMessageBus(options: any): any
  export function createTypedMessageSender<T>(
    bus: any,
    messageType: string
  ): (payload: T) => void
  export function createTypedMessageSubscriber<T>(
    bus: any,
    messageType: string
  ): (callback: (payload: T) => void) => () => void

  // Core types
  export interface MessageBus {
    send: (type: string, data: any) => void
    subscribe: (type: string, callback: (data: any) => void) => () => void
    broadcast: (type: string, data: any) => void
  }

  export interface MessageBusOptions {
    appId: string
    debug?: boolean
    allowedOrigins?: string[]
  }

  export type MessageSubscriber = (data: any, source?: any) => void
}
