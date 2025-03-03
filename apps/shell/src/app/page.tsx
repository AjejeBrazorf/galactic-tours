'use client'

import React from 'react'

import { DestinationsDetails } from '@/components/DestinationDetails'
import { DestinationsMap } from '@/components/DestinationsMap'
import { useDestinations } from '@/providers/DestinationsProvider'
import styles from './page.module.scss'

const Home: React.FC = () => {
  const { activeDestination } = useDestinations()

  return (
    <div className={styles.root}>
      <h1>Galactic Tours Explorer</h1>

      <div className={styles.mainContent}>
        <div className={styles.mapContainer}>
          <DestinationsMap className={styles.iframe} />
        </div>
        {activeDestination && <DestinationsDetails {...activeDestination} />}
      </div>
    </div>
  )
}

export default Home
