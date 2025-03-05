import { APP_CONFIG } from '@/app/appConfig'
import { FC, useEffect, useState } from 'react'

interface DestinationsMapProps {
  className?: string
}

export const DestinationsMap: FC<DestinationsMapProps> = ({ className }) => {
  if (!APP_CONFIG.features.destinations.map.iframe.src) {
    return <div className={className} style={{ background: '#0f0f1a' }} />
  }

  return (
    <iframe
      src={APP_CONFIG.features.destinations.map.iframe.src}
      title={APP_CONFIG.features.destinations.map.iframe.title}
      className={className}
      allow='autoplay; fullscreen; accelerometer; encrypted-media; gyroscope; midi'
    />
  )
}
