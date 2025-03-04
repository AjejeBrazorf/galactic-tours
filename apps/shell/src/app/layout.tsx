import '@galactic-tours/ui/theme.css'
import type { Metadata } from 'next'
import { JSX } from 'react'
import ClientProviders from '../providers/ClientProviders'

export const metadata: Metadata = {
  title: 'Galactic Tours',
  description: 'Explore the wonders of the galaxy',
}

/**
 * Root Layout
 *
 * Uses a client-component wrapper for providers to ensure
 * they only run on the client side, avoiding SSR issues.
 */
export default function RootLayout({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) {
  return (
    <html lang='en'>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
