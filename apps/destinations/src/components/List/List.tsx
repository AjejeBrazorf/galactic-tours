import clsx from 'clsx'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './List.module.scss'

import { getDetailPath } from '@/routes/PATHS'
import { useDestinations } from '@/providers/DestinationsProvider'

export const List: React.FC = () => {
  const { destinations, activeDestination, selectDestination } =
    useDestinations()
  const navigate = useNavigate()

  const handleDestinationClick = (destinationId: string) => {
    // Update the active destination in the context
    selectDestination(destinationId)

    // Navigate to the detail view with the destination ID in the URL
    navigate(getDetailPath(destinationId))
  }

  return (
    <ul>
      {destinations.map((destination) => (
        <li
          key={destination.id}
          className={clsx(
            styles.listItem,
            destination.id === activeDestination?.id && styles.active
          )}
          onClick={() => handleDestinationClick(destination.id)}>
          {destination.name}
        </li>
      ))}
    </ul>
  )
}

export default List
