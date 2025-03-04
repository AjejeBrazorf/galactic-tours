'use client'

import { DestinationsDetails } from '@/components/DestinationDetails/DestinationsDetails'
import { DestinationsMap } from '@/components/DestinationsMap'
import { useDestinations } from '@galactic-tours/messaging'
import styles from './page.module.scss'
export default function Home() {
  const { activeDestination } = useDestinations()
  return (
    <main className={styles.root}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Galactic Tours</h1>
        <p className={styles.description}>
          Explore the wonders of the galaxy through our curated destinations
        </p>
      </section>

      <section className={styles.mapContainer}>
        <DestinationsMap className={styles.map} />
      </section>
      {activeDestination && (
        <DestinationsDetails
          name={activeDestination.name}
          coordinates={{
            x: activeDestination.position[0] || 0,
            y: activeDestination.position[1] || 0,
            z: activeDestination.position[2] || 0,
          }}
          description={activeDestination.description}
          price={activeDestination.price}
          distance={activeDestination.distance}
        />
      )}
    </main>
  )
}
