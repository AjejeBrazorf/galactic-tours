'use client'

import styles from './page.module.scss'

import Map from '@/components/Map'

export default function Home() {
  return (
    <main className={styles.main}>
      <Map />
    </main>
  )
}
