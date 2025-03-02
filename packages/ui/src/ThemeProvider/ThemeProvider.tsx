import './theme.css'
import type { ReactNode } from 'react'

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

export default ThemeProvider
