/**
 * Destination Provider
 *
 * Manages destination-related state and messaging across microfrontends.
 * Handles selected destinations and destination details requests.
 *
 * This provider does NOT fetch data directly - the destinations app is responsible
 * for that. This provider only manages the shared state and message passing.
 */

import type { ReactNode } from 'react'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import type {
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

const DestinationContext = createContext<DestinationContextType | null>(null)

interface DestinationProviderProps {
  children: ReactNode
  initialDestinations?: Destination[]
  enableRelay?: boolean
}

/**
 * Provider for destination-related state and messaging
 */
export const DestinationProvider: React.FC<DestinationProviderProps> = ({
  children,
  initialDestinations = [],
  enableRelay = false,
}) => {
  // State
  const [activeDestination, setActiveDestination] =
    useState<Destination | null>(null)
  const [destinations, setDestinationsState] =
    useState<Destination[]>(initialDestinations)
  const [loading, setLoadingState] = useState(false)

  // Get the message bus
  const messageBus = useMessage()

  // Track most recently processed message IDs to prevent loops
  const recentlyProcessedMessages = useRef<Set<string>>(new Set())

  // Track if we're currently processing a received message
  const isHandlingMessage = useRef<boolean>(false)

  // Generate a unique message ID
  const generateMessageId = () => {
    return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9)
  }

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

  // Message handling function
  const handleDestinationMessage = (data: any) => {
    // Check if this message contains an ID we've already processed
    if (data._relayId && recentlyProcessedMessages.current.has(data._relayId)) {
      if (enableRelay) {
        console.log('Ignoring already relayed message:', data._relayId)
      }
      return
    }

    // Extract the destination from the message
    const destination =
      data.destination || (data.payload && data.payload.destination)

    // Check if the destination field exists in the message
    // We need to handle the case where destination is explicitly null (valid case for deselection)
    if (
      typeof data.destination === 'undefined' &&
      (!data.payload || typeof data.payload.destination === 'undefined')
    ) {
      console.warn('Received malformed destination selection message:', data)
      return
    }

    // Set the flag that we're handling a received message
    isHandlingMessage.current = true

    try {
      // Update our local state with the selected destination
      if (destination) {
        console.log('Updating active destination from message:', destination.id)
      } else {
        console.log('Clearing active destination from message')
      }
      setActiveDestination(destination)
    } finally {
      // Always reset the flag when done
      isHandlingMessage.current = false
    }

    // If we're the relay provider, relay the message to other microfrontends
    if (enableRelay && messageBus) {
      console.log('Relaying destination selection to other microfrontends')

      // Add a relay ID to track this message
      const relayId = generateMessageId()
      recentlyProcessedMessages.current.add(relayId)

      // Clean up old message IDs (keep only last 100)
      if (recentlyProcessedMessages.current.size > 100) {
        const values = Array.from(recentlyProcessedMessages.current)
        recentlyProcessedMessages.current = new Set(values.slice(-100))
      }

      // Clone the data and add the relay ID
      const relayedData = { ...data, _relayId: relayId }

      // Broadcast to all microfrontends
      messageBus.broadcast(DESTINATION_MESSAGES.SELECTED, relayedData)
    }
  }

  // Set up message subscriptions
  useEffect(() => {
    if (!messageBus) return

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
      console.log('Received destination selected message:', payload)
      handleDestinationMessage(payload)
    })

    const unsubDetailsResponse = detailsResponseSubscriber((payload) => {
      if (payload.destination) {
        // Find the destination in our local state and update it if it exists
        const index = destinations.findIndex(
          (d) => d.id === payload.destination?.id
        )

        if (index >= 0) {
          const updatedDestinations = [...destinations]
          updatedDestinations[index] = payload.destination
          setDestinationsState(updatedDestinations)
        }

        // If this is the currently active destination, update it
        if (activeDestination?.id === payload.destination.id) {
          setActiveDestination(payload.destination)
        }
      }
    })

    // Clean up subscriptions
    return () => {
      unsubSelected()
      unsubDetailsResponse()
    }
  }, [messageBus, destinations, activeDestination, enableRelay])

  // State update methods
  const setDestinations = (newDestinations: Destination[]) => {
    setDestinationsState(newDestinations)
  }

  const setLoading = (isLoading: boolean) => {
    setLoadingState(isLoading)
  }

  // Destination actions
  const selectDestination = (destinationId: string | null) => {
    // Don't send message if we're currently handling a received message
    // This prevents message loops
    if (isHandlingMessage.current) {
      console.log(
        'Skipping sending message because we are handling a received message'
      )
      return
    }

    // Look up the destination by ID
    const destination = destinations.find((d) => d.id === destinationId) ?? null

    // Update local state first
    setActiveDestination(destination)

    // Send the message if we have a message bus
    if (messageBus) {
      console.log(`Sending destination selection:`, {
        destinationId,
        destination,
      })

      // Send the message without a relay ID
      sendDestinationSelected({
        destination,
      })
    }
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
