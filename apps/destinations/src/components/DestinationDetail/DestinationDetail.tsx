import React, { useEffect } from 'react'

import styles from './DestinationDetail.module.scss'

import { useDestinations } from '@/providers/DestinationsProvider'

interface DestinationDetailProps {
  className?: string
  destinationId?: string | null
}

export const DestinationDetail: React.FC<DestinationDetailProps> = ({
  className,
  destinationId,
}) => {
  const { destinations, activeDestination, requestDestinationDetails } =
    useDestinations()

  // Request details for the destination if a specific ID is provided
  useEffect(() => {
    if (destinationId) {
      requestDestinationDetails(destinationId)
    }
  }, [destinationId, requestDestinationDetails])

  // Determine which destination to display
  const destination = React.useMemo(() => {
    // When destinationId is explicitly provided
    if (destinationId !== undefined && destinationId !== null) {
      const found = destinations.find((d) => d.id === destinationId)
      // Only return the found destination if it exists
      return found || null
    }
    // Otherwise fall back to the activeDestination
    return activeDestination
  }, [destinationId, destinations, activeDestination])

  if (!destination) {
    return (
      <div
        className={
          className ? `${styles.emptyState} ${className}` : styles.emptyState
        }>
        <p>Select a destination to view details</p>
      </div>
    )
  }

  return (
    <div
      className={
        className ? `${styles.container} ${className}` : styles.container
      }>
      <h2 className={styles.title}>{destination.name}</h2>

      {destination.description && (
        <p className={styles.description}>{destination.description}</p>
      )}

      {destination.image && (
        <div className={styles.imageContainer}>
          <img
            src={destination.image}
            alt={destination.name}
            className={styles.image}
          />
        </div>
      )}

      {/* Display additional destination details if available */}
      <div className={styles.details}>
        {destination.climate && (
          <div className={styles.detailItem}>
            <span className={styles.label}>Climate:</span>
            <span className={styles.value}>{destination.climate}</span>
          </div>
        )}

        {destination.attractions && destination.attractions.length > 0 && (
          <div className={styles.detailItem}>
            <span className={styles.label}>Top Attractions:</span>
            <ul className={styles.attractionsList}>
              {destination.attractions.map(
                (attraction: string, index: number) => (
                  <li key={index} className={styles.attraction}>
                    {attraction}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {destination.travelTime && (
          <div className={styles.detailItem}>
            <span className={styles.label}>Travel Time:</span>
            <span className={styles.value}>{destination.travelTime}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default DestinationDetail
