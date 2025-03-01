import type { FC, ReactNode } from 'react'

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
      style={{
        border: 0,
        borderRadius: '8px',
        padding: '10px 20px',
        color: 'white',
        backgroundColor: variant === 'primary' ? 'blue' : 'green',
      }}
      onClick={onClick}>
      {children}
    </button>
  )
}
