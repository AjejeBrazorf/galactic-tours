import { FC } from 'react'

interface DestinationData {
  name: string
  coordinates?: { x: number; y: number; z: number }
  position?: [number, number, number]
  description?: string
  price?: number
  distance?: number
}

import { useDestinations } from '@galactic-tours/messaging'
import { Button } from '@galactic-tours/ui'
import styles from './DestinationsDetails.module.scss'
export const DestinationsDetails: FC<DestinationData> = ({
  name,
  coordinates,
  position,
  description,
  price,
  distance,
}) => {
  const { selectDestination } = useDestinations()
  return (
    <div className={styles.destinationInfo}>
      <Button variant='secondary' onClick={() => selectDestination(null)}>
        Back
      </Button>
      <h2>{name}</h2>
      <p>
        <strong>Coordinates:</strong>
        {coordinates ? (
          <span>
            X: {coordinates.x}, Y: {coordinates.y}, Z: {coordinates.z}
          </span>
        ) : position ? (
          <span>
            X: {position[0]}, Y: {position[1]}, Z: {position[2]}
          </span>
        ) : (
          <span>Not available</span>
        )}
      </p>
      {description && (
        <p>
          <strong>Description:</strong> {description}
        </p>
      )}
      {price && (
        <p>
          <strong>Price:</strong> {price}
        </p>
      )}
      {distance && (
        <p>
          <strong>Distance:</strong> {distance}
        </p>
      )}
    </div>
  )
}
