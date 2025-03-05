import { clsx } from 'clsx'
import type { ReactNode } from 'react'

import styles from './Button.module.scss'
interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'text'
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
        [`${styles.text}`]: variant === 'text',
      })}
      onClick={onClick}>
      {children}
    </button>
  )
}
