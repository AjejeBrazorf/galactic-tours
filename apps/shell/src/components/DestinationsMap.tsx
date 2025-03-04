import { APP_CONFIG } from '@/app/appConfig'
import { FC, useEffect, useState } from 'react'

interface DestinationsMapProps {
  className?: string
}

export const DestinationsMap: FC<DestinationsMapProps> = ({ className }) => {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null)

  useEffect(() => {
    setIframeSrc(APP_CONFIG.DESTINATION_APP_URL || 'http://localhost:5173')
  }, [])

  if (!iframeSrc) {
    return <div className={className} style={{ background: '#0f0f1a' }} />
  }

  return (
    <iframe
      src={iframeSrc}
      title='Destinations Map'
      className={className}
      allow='autoplay; fullscreen; accelerometer; encrypted-media; gyroscope; midi'
    />
  )
}
