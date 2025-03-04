import {
  DESTINATION_MESSAGES,
  Destination,
  DestinationProvider as MessagingDestinationProvider,
  useDestinations as useMessagingDestinations,
} from '@galactic-tours/messaging'
import { useCallback, useEffect, useRef, useState } from 'react'
import { destinationService } from '../services/destination-service'
import { useMessage } from './MessageProvider'

export const DestinationsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [destinations, setDestinationsData] = useState<Destination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await destinationService.getDestinations()
        setDestinationsData(data)
        setIsLoading(false)
        setIsMounted(true)
      } catch (error) {
        console.error('Failed to load initial destinations data:', error)
        setIsLoading(false)
        setIsMounted(true)
      }
    }

    loadInitialData()
  }, [])
  return (
    <MessagingDestinationProvider initialDestinations={destinations}>
      {!isMounted || isLoading ? (
        <div className='destinations-loading'>Loading destinations...</div>
      ) : (
        <DestinationsDataManager>{children}</DestinationsDataManager>
      )}
    </MessagingDestinationProvider>
  )
}

const DestinationsDataManager = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const messageBus = useMessage()
  const {
    destinations,
    setDestinations,
    setLoading,
    provideDestinationDetails,
  } = useMessagingDestinations()

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
      setLoading(true)
      try {
        if (destinations.length === 0) {
          const data = await destinationService.getDestinations()
          setDestinations(data)
        }
      } catch (error) {
        console.error('Failed to load destinations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDestinations()
  }, [setDestinations, setLoading])

  useEffect(() => {
    if (!messageBus) return

    console.log('Setting up destination details subscription')
    const unsubscribe = messageBus.subscribe(
      DESTINATION_MESSAGES.DETAILS_REQUESTED,
      handleDestinationDetailsRequest
    )

    return () => {
      console.log('Cleaning up destination details subscription')
      unsubscribe()
    }
  }, [messageBus, handleDestinationDetailsRequest])

  return <>{children}</>
}

export { useMessagingDestinations as useDestinations }
