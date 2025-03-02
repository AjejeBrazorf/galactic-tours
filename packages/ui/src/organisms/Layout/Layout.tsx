import type { ReactNode } from 'react'

import styles from './Layout.module.scss'

export const Layout = ({ children }: { children: ReactNode }) => {
  return <div className={styles.root}>{children}</div>
}
