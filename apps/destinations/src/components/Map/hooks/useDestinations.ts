import destinations from '@/data/destinations.json'
import { useState } from 'react'
import { DestinationData } from '../types'

const typedDestinations: DestinationData[] = destinations.map((d) => ({
  ...d,
  position: d.position as [number, number, number],
}))

export const useDestinations = () => {
  const [activeDestination, setActiveDestination] =
    useState<DestinationData | null>(null)

  const handleDestinationClick = (destinationId: string) => {
    setActiveDestination(
      typedDestinations.find((d) => d.id.toString() === destinationId) || null
    )
  }

  return {
    destinations: typedDestinations,
    activeDestination,
    handleDestinationClick,
  }
}
