import type { FC } from 'react'

import { APP_CONFIG } from '@/app/appConfig'

interface DestinationDetailProps {
  className?: string
  destinationId: string | null
}

export const DestinationDetail: FC<DestinationDetailProps> = ({
  className,
  destinationId,
}) => {
  if (!APP_CONFIG.features.destinations.detail.iframe.src || !destinationId) {
    return <div className={className} style={{ background: '#0f0f1a' }} />
  }

  return (
    <iframe
      src={APP_CONFIG.features.destinations.detail.iframe.src(destinationId)}
      title={APP_CONFIG.features.destinations.detail.iframe.title}
      className={className}
      allow='autoplay; fullscreen; accelerometer; encrypted-media; gyroscope; midi'
    />
  )
}
