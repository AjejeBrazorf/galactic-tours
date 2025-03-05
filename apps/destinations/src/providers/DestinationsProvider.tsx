import {
  DESTINATION_MESSAGES,
  DestinationProvider as MessagingDestinationProvider,
  useMessage,
  useDestinations as useMessagingDestinations,
} from '@galactic-tours/messaging'
import { useCallback, useEffect, useRef } from 'react'

import { destinationService } from '../services/destination-service'

export const DestinationsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <MessagingDestinationProvider initialDestinations={[]} enableRelay={false}>
      <DestinationsDataManager>{children}</DestinationsDataManager>
    </MessagingDestinationProvider>
  )
}

const DestinationsDataManager = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const messageBus = useMessage()
  const { destinations, setDestinations, provideDestinationDetails } =
    useMessagingDestinations()

  const provideDetailsRef = useRef(provideDestinationDetails)

  useEffect(() => {
    provideDetailsRef.current = provideDestinationDetails
  }, [provideDestinationDetails])

  const handleDestinationDetailsRequest = useCallback(async (message: any) => {
    const { destinationId } = message.payload
    try {
      const destination =
        await destinationService.getDestinationById(destinationId)
      provideDetailsRef.current(destination)
    } catch (error) {
      console.error(`Failed to fetch destination ${destinationId}:`, error)
    }
  }, [])

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        if (destinations.length === 0) {
          const data = await destinationService.getDestinations()
          setDestinations(data)
        }
      } catch (error) {
        console.error('Failed to load destinations:', error)
      }
    }

    loadDestinations()
  }, [destinations.length, setDestinations])

  useEffect(() => {
    if (!messageBus) return

    const detailsUnsubscribe = messageBus.subscribe(
      DESTINATION_MESSAGES.DETAILS_REQUESTED,
      handleDestinationDetailsRequest
    )

    return () => {
      console.log('Cleaning up destination details subscription')
      detailsUnsubscribe()
    }
  }, [messageBus, handleDestinationDetailsRequest])

  return <>{children}</>
}

export { useMessagingDestinations as useDestinations }
