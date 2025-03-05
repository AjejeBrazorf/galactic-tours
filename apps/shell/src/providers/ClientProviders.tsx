'use client'

import { DestinationProvider, MessageProvider } from '@galactic-tours/messaging'
import React from 'react'

import { APP_CONFIG } from '@/app/appConfig'

/**
 * Client Providers Component
 *
 * This is a client component that wraps all providers.
 * By using 'use client' directive, we ensure it only runs on the client side,
 * avoiding SSR issues with context providers that require browser APIs.
 *
 * Important: The order of providers matters. MessageProvider must be the outermost
 * provider since other providers depend on it.
 */
export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MessageProvider
      appId='shell'
      debug={process.env.NODE_ENV === 'development'}
      allowedOrigins={APP_CONFIG.getAllowedOrigins()}>
      <DestinationProvider initialDestinations={[]} enableRelay={true}>
        {children}
      </DestinationProvider>
    </MessageProvider>
  )
}
