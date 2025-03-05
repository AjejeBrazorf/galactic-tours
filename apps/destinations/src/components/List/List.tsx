import { useDestinations } from '@/providers/DestinationsProvider'
import styles from './List.module.scss'
import React from 'react'
import clsx from 'clsx'
export const List: React.FC = () => {
  const { destinations, activeDestination, selectDestination } =
    useDestinations()

  return (
    <div style={{ width: '100%', height: '100vh', padding: '20px' }}>
      <h1>Destinations List</h1>
      <ul>
        {destinations.map((destination) => (
          <li
            key={destination.id}
            className={clsx(
              styles.listItem,
              destination.id === activeDestination?.id && styles.active
            )}
            onClick={() => selectDestination(destination.id)}>
            {destination.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default List
