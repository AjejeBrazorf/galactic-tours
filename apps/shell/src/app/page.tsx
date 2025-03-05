'use client'

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
    </main>
  )
}
