import { FC } from 'react'

interface DestinationData {
  name: string
  coordinates?: { x: number; y: number; z: number }
  position?: [number, number, number]
  description?: string
  timestamp?: string
}

import styles from './DestinationsDetails.module.scss'
export const DestinationsDetails: FC<DestinationData> = ({
  name,
  coordinates,
  position,
  description,
  timestamp,
}) => {
  return (
    <div className={styles.destinationInfo}>
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
      {timestamp && (
        <p>
          <small>Selected at: {new Date(timestamp).toLocaleTimeString()}</small>
        </p>
      )}
    </div>
  )
}
