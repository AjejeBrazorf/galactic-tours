import type { FC, ReactNode } from 'react'
import { clsx } from 'clsx'

import styles from './Button.module.scss'
interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  dataTestId?: string
}
export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  dataTestId,
}) => {
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
