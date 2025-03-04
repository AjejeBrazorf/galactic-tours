'use client'

import { APP_CONFIG } from '@/app/appConfig'
import { DestinationProvider, MessageProvider } from '@galactic-tours/messaging'
import React from 'react'

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
      allowedOrigins={[
        APP_CONFIG.SHELL_APP_URL,
        APP_CONFIG.DESTINATION_APP_URL,
      ]}>
      <DestinationProvider initialDestinations={[]}>
        {children}
      </DestinationProvider>
    </MessageProvider>
  )
}
