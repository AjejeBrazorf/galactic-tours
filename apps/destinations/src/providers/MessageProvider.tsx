'use client'

import { MessageProvider as BaseMessageProvider } from '@galactic-tours/messaging'

import { APP_CONFIG } from '@/appConfig'

/**
 * Destinations app MessageProvider
 *
 * This component wraps the messaging package's MessageProvider to provide
 * destinations-specific configuration.
 */
export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <BaseMessageProvider
      appId='destinations'
      debug={APP_CONFIG.DEBUG}
      allowedOrigins={APP_CONFIG.getAllowedOrigins()}>
      {children}
    </BaseMessageProvider>
  )
}
