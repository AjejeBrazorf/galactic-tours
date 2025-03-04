/**
 * Destination Provider
 *
 * Manages destination-related state and messaging across microfrontends.
 * Handles selected destinations and destination details requests.
 *
 * This provider does NOT fetch data directly - the destinations app is responsible
 * for that. This provider only manages the shared state and message passing.
 */

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  Destination,
  DestinationDetailsRequestedPayload,
  DestinationDetailsResponsePayload,
  DestinationSelectedPayload,
} from '../constants/message-payloads'
import { DESTINATION_MESSAGES } from '../constants/message-types'
import {
  createTypedMessageSender,
  createTypedMessageSubscriber,
  useMessage,
} from './message-provider'

// Destination context interface
interface DestinationContextType {
  // State
  activeDestination: Destination | null
  destinations: Destination[]
  loading: boolean

  // State Update Methods
  setDestinations: (destinations: Destination[]) => void
  setLoading: (loading: boolean) => void

  // Actions
  selectDestination: (destinationId: string | null) => void
  requestDestinationDetails: (destinationId: string) => void
  provideDestinationDetails: (destination: Destination) => void
}

// Create the context
const DestinationContext = createContext<DestinationContextType | null>(null)

// Provider props
interface DestinationProviderProps {
  children: ReactNode
  initialDestinations?: Destination[]
}

/**
 * Provider for destination-related state and messaging
 */
export const DestinationProvider: React.FC<DestinationProviderProps> = ({
  children,
  initialDestinations = [],
}) => {
  // State
  const [activeDestination, setActiveDestination] =
    useState<Destination | null>(null)
  const [destinations, setDestinationsState] =
    useState<Destination[]>(initialDestinations)
  const [loading, setLoadingState] = useState(false)

  // Get the message bus
  const messageBus = useMessage()

  // Create typed message senders
  const sendDestinationSelected =
    createTypedMessageSender<DestinationSelectedPayload>(
      messageBus,
      DESTINATION_MESSAGES.SELECTED
    )

  const sendDestinationDetailsRequested =
    createTypedMessageSender<DestinationDetailsRequestedPayload>(
      messageBus,
      DESTINATION_MESSAGES.DETAILS_REQUESTED
    )

  const sendDestinationDetailsResponse =
    createTypedMessageSender<DestinationDetailsResponsePayload>(
      messageBus,
      DESTINATION_MESSAGES.DETAILS_RESPONSE
    )

  // Set up message subscriptions
  useEffect(() => {
    // Subscribe to destination selected messages
    const selectedSubscriber =
      createTypedMessageSubscriber<DestinationSelectedPayload>(
        messageBus,
        DESTINATION_MESSAGES.SELECTED
      )

    const detailsResponseSubscriber =
      createTypedMessageSubscriber<DestinationDetailsResponsePayload>(
        messageBus,
        DESTINATION_MESSAGES.DETAILS_RESPONSE
      )

    const unsubSelected = selectedSubscriber((payload) => {
      setActiveDestination(payload.destination)
    })

    const unsubDetailsResponse = detailsResponseSubscriber((payload) => {
      if (payload.destination) {
      }
    })

    // Clean up subscriptions
    return () => {
      unsubSelected()
      unsubDetailsResponse()
    }
  }, [messageBus])

  // State update methods
  const setDestinations = (newDestinations: Destination[]) => {
    setDestinationsState(newDestinations)
  }

  const setLoading = (isLoading: boolean) => {
    setLoadingState(isLoading)
  }

  // Destination actions
  const selectDestination = (destinationId: string | null) => {
    const destination = destinations.find((d) => d.id === destinationId) ?? null
    setActiveDestination(destination)

    // Broadcast destination selected
    sendDestinationSelected({
      destination,
    })
  }

  const requestDestinationDetails = (destinationId: string) => {
    // Broadcast destination details requested
    sendDestinationDetailsRequested({
      destinationId,
    })
  }

  const provideDestinationDetails = (destination: Destination) => {
    // Broadcast destination details response
    sendDestinationDetailsResponse({
      destination,
    })
  }

  // Context value
  const contextValue: DestinationContextType = {
    activeDestination,
    destinations,
    loading,
    setDestinations,
    setLoading,
    selectDestination,
    requestDestinationDetails,
    provideDestinationDetails,
  }

  return (
    <DestinationContext.Provider value={contextValue}>
      {children}
    </DestinationContext.Provider>
  )
}

/**
 * Hook for accessing destination context
 */
export const useDestinations = (): DestinationContextType => {
  const context = useContext(DestinationContext)
  if (!context) {
    throw new Error('useDestinations must be used within a DestinationProvider')
  }
  return context
}
