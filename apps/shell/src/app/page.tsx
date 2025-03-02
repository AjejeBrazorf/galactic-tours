'use client'

import dynamic from 'next/dynamic'

import styles from './page.module.scss'

import { TestView } from '@/components/testView'

const DynamicMapWrapper = dynamic(
  () =>
    import('@/components/MapWrapper').then((mod) => ({
      default: mod.default,
    })) as Promise<{ default: React.ComponentType<Record<string, unknown>> }>,
  {
    ssr: false,
    loading: () => <div>Loading Map Component...</div>,
  }
)

const Home: React.FC = () => {
  return (
    <div className={styles.root}>
      <h1>Galactic Tours Map</h1>
      <DynamicMapWrapper />
      <TestView />
    </div>
  )
}

export default Home
