import type { ReactNode } from 'react'
import { clsx } from 'clsx'

import styles from './Button.module.scss'
interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  dataTestId?: string
}
export const Button = ({
  children,
  onClick,
  variant = 'primary',
  dataTestId,
}: ButtonProps) => {
  return (
    <button
      data-testid={dataTestId}
      className={clsx(styles.root, {
        [`${styles.primary}`]: variant === 'primary',
        [`${styles.secondary}`]: variant === 'secondary',
      })}
      onClick={onClick}>
      {children}
    </button>
  )
}
