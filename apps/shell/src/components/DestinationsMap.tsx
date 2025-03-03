import { FC } from 'react'

interface DestinationsMapProps {
  className?: string
}

export const DestinationsMap: FC<DestinationsMapProps> = ({ className }) => {
  return (
    <iframe
      src='http://localhost:5173'
      title='Destinations Map'
      className={className}
      allow='autoplay; fullscreen; accelerometer; encrypted-media; gyroscope; midi'
    />
  )
}
