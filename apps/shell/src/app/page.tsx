'use client'

import styles from './page.module.scss'

import { TestView } from '@/components/testView'

const Home: React.FC = () => {
  return (
    <div className={styles.root}>
      <h1>My NextJs App</h1>
      <TestView />
    </div>
  )
}

export default Home
