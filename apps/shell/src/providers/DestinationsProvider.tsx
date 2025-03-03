'use client'
import { useMessage } from '@/providers/MessageProvider'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const destinationsAppId = 'destinations'

const MESSAGE_TYPE = 'DESTINATION'

const MESSAGES = {
  [MESSAGE_TYPE]: {
    SELECTED: 'destination.selected',
    BOOKMARKED: 'destination.bookmarked',
    RATED: 'destination.rated',
  },
}

interface Coordinates {
  x: number
  y: number
  z: number
}

interface DestinationData {
  id: string | number
  name: string
  coordinates?: Coordinates
  position?: [number, number, number]
  description?: string
  color?: string
  timestamp?: string
}

interface DestinationsContextType {
  activeDestination: DestinationData | null
  setActiveDestination: (destination: DestinationData) => void
}
const DestinationsContext = createContext<DestinationsContextType | null>(null)

export const DestinationsProvider = ({ children }: { children: ReactNode }) => {
  const [activeDestination, setActiveDestination] =
    useState<DestinationData | null>(null)
  const messageBus = useMessage()
  useEffect(() => {
    if (!messageBus) {
      return
    }

    const destinationSelected = messageBus.subscribe(
      MESSAGES.DESTINATION.SELECTED,
      (data) => {
        setActiveDestination(data.payload as DestinationData)
      }
    )

    return () => {
      messageBus.unregisterChild(destinationsAppId)
      messageBus.unsubscribe(destinationSelected)
    }
  }, [messageBus, destinationsAppId])

  return (
    <DestinationsContext.Provider
      value={useMemo(
        () => ({
          activeDestination,
          setActiveDestination,
        }),
        [activeDestination, setActiveDestination]
      )}>
      {children}
    </DestinationsContext.Provider>
  )
}

export const useDestinations = () => {
  const context = useContext(DestinationsContext)
  if (!context) {
    throw new Error(
      'useDestinations must be used within a DestinationsProvider'
    )
  }
  return context
}
