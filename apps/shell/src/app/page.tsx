'use client'

import React from 'react'

import { DestinationsDetails } from '@/components/DestinationDetails'
import { DestinationsMap } from '@/components/DestinationsMap'
import { useDestinations } from '@/providers/DestinationsProvider'
import clsx from 'clsx'
import styles from './page.module.scss'
const Home: React.FC = () => {
  const { activeDestination } = useDestinations()

  return (
    <div className={styles.root}>
      <header id='hero' className={styles.hero}>
        <h1>Galactic Tours Explorer</h1>
        <p>Explore the best destinations in the galaxy.</p>
      </header>

      <section id='map' className={clsx(styles.mapContainer, styles.fullWidth)}>
        <DestinationsMap className={styles.iframe} />
      </section>
      {activeDestination && <DestinationsDetails {...activeDestination} />}
    </div>
  )
}

export default Home
