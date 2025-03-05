'use client'

import { useDestinations } from '@galactic-tours/messaging'
import { Button, ResponsiveDrawer } from '@galactic-tours/ui'

import styles from './page.module.scss'

import { DestinationDetail } from '@/components/DestinationsDetail'
import { DestinationsList } from '@/components/DestinationsList'
import { DestinationsMap } from '@/components/DestinationsMap'

export default function Home() {
  const { activeDestination, selectDestination } = useDestinations()

  return (
    <main className={styles.root}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Galactic Tours</h1>
        <p className={styles.description}>
          Explore the wonders of the galaxy through our curated destinations
        </p>
      </section>

      <section className={styles.destinationsSection}>
        <DestinationsMap className={styles.map} />
        <ResponsiveDrawer
          open={true}
          actions={
            activeDestination
              ? [
                  <Button
                    variant='text'
                    key='back'
                    onClick={() => {
                      selectDestination(null)
                    }}>
                    Back
                  </Button>,
                ]
              : []
          }>
          {!activeDestination && (
            <>
              <h2>Select a destination</h2>
              <DestinationsList className={styles.list} />
            </>
          )}
          {activeDestination && (
            <>
              <DestinationDetail
                className={styles.detail}
                destinationId={activeDestination.id}
              />
            </>
          )}
        </ResponsiveDrawer>
      </section>
    </main>
  )
}
