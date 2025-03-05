import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { useRef, useState } from 'react'

import { useIsMobile } from '../../hooks/isMobile'

import styles from './ResponsiveDrawer.module.scss'

interface ResponsiveDrawerProps {
  children: ReactNode
  actions?: ReactNode
  dataTestId?: string
  open: boolean
}

export const ResponsiveDrawer = ({
  children,
  actions,
  dataTestId,
  open,
}: ResponsiveDrawerProps) => {
  const isMobile = useIsMobile()
  const [dragStartY, setDragStartY] = useState(0)
  const [currentHeight, setCurrentHeight] = useState(0)
  const drawerRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isMobile || !drawerRef.current) return

    let clientY: number
    if ('touches' in e) {
      clientY = e.touches?.[0]?.clientY ?? 0
    } else {
      clientY = e.clientY
    }

    setDragStartY(clientY)
    const height = drawerRef.current.getBoundingClientRect().height
    setCurrentHeight(height)

    if ('touches' in e) {
      document.addEventListener('touchmove', handleDragMove)
      document.addEventListener('touchend', handleDragEnd)
    } else {
      document.addEventListener('mousemove', handleDragMove)
      document.addEventListener('mouseup', handleDragEnd)
    }
  }

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!drawerRef.current) return

    let clientY: number
    if ('touches' in e) {
      clientY = e.touches?.[0]?.clientY ?? 0
    } else {
      clientY = e.clientY
    }

    const deltaY = dragStartY - clientY
    const newHeight = Math.min(
      Math.max(currentHeight + deltaY, 200),
      window.innerHeight
    )

    drawerRef.current.style.height = `${newHeight}px`
  }

  const handleDragEnd = () => {
    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)
    document.removeEventListener('touchmove', handleDragMove)
    document.removeEventListener('touchend', handleDragEnd)
  }

  return (
    <div
      ref={drawerRef}
      data-testid={dataTestId}
      className={clsx(
        styles.root,
        isMobile ? styles.mobile : styles.desktop,
        open && styles.open
      )}>
      {isMobile && (
        <>
          <div
            className={styles.handle}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          />
          {actions && <div className={styles.actions}>{actions}</div>}
        </>
      )}
      <div className={styles.content}>{children}</div>
      {!isMobile && actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
