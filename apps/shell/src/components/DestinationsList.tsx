import type { FC } from 'react'
import { useEffect, useState } from 'react'

import { APP_CONFIG } from '@/app/appConfig'

interface DestinationsListProps {
  className?: string
}

export const DestinationsList: FC<DestinationsListProps> = ({ className }) => {
  if (!APP_CONFIG.features.destinations.list.iframe.src) {
    return <div className={className} style={{ background: '#0f0f1a' }} />
  }

  return (
    <iframe
      src={APP_CONFIG.features.destinations.list.iframe.src}
      title={APP_CONFIG.features.destinations.list.iframe.title}
      className={className}
      allow='autoplay; fullscreen; accelerometer; encrypted-media; gyroscope; midi'
    />
  )
}
