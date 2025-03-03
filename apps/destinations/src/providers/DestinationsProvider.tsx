import type { DestinationData } from '@/components/Map/types'
import destinations from '@/data/destinations.json'
import { useMessage } from '@/providers/MessageProvider'
import { MessageDirection } from '@galactic-tours/messaging'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const SHELL_APP_ID = 'shell'

const MESSAGE_TYPE = 'DESTINATION'

const MESSAGES = {
  [MESSAGE_TYPE]: {
    SELECTED: 'destination.selected',
    BOOKMARKED: 'destination.bookmarked',
    RATED: 'destination.rated',
  },
}

const typedDestinations: DestinationData[] = destinations.map((d) => ({
  ...d,
  position: d.position as [number, number, number],
}))

interface DestinationsContextType {
  destinations: DestinationData[]
  activeDestination: DestinationData | null
  setActiveDestination: (destination: DestinationData) => void
}

const DestinationsContext = createContext<DestinationsContextType | null>(null)

export const DestinationsProvider = ({ children }: { children: ReactNode }) => {
  const [activeDestination, setActiveDestination] =
    useState<DestinationData | null>(null)
  const messageBus = useMessage()
  useEffect(() => {
    if (activeDestination) {
      try {
        messageBus.send(
          MESSAGES.DESTINATION.SELECTED,
          {
            ...activeDestination,
            // Ensure we're sending a serializable object
            position: activeDestination.position
              ? [
                  activeDestination.position[0],
                  activeDestination.position[1],
                  activeDestination.position[2],
                ]
              : undefined,
            coordinates: {
              x: activeDestination.position[0],
              y: activeDestination.position[1],
              z: activeDestination.position[2],
            },
          },
          {
            target: SHELL_APP_ID,
            direction: MessageDirection.CHILD_TO_PARENT,
          }
        )

        console.debug('Message sent successfully')
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
  }, [activeDestination, messageBus])
  return (
    <DestinationsContext.Provider
      value={useMemo(
        () => ({
          destinations: typedDestinations,
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
