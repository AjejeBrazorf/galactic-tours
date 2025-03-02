'use client'

import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

// Extend the JSX.IntrinsicElements directly without creating unused interfaces
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'destinations-map': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
    }
  }

  interface HTMLElementTagNameMap {
    'destinations-map': HTMLElement
  }
}

// Create a client component that will handle the web component
const WebComponentContainer: React.FC = () => {
  const [componentLoaded, setComponentLoaded] = useState(false)

  useEffect(() => {
    // Only run in browser
    const loadComponent = async () => {
      try {
        if (!customElements.get('destinations-map')) {
          console.debug('Loading destinations-map web component...')
          // eslint-disable-next-line import/extensions
          await import('destinations/dist/index.js')

          // Check if component registered successfully
          if (customElements.get('destinations-map')) {
            console.debug('Component registered successfully')
            setComponentLoaded(true)
          } else {
            console.error('Component failed to register')
          }
        } else {
          setComponentLoaded(true)
        }
      } catch (err) {
        console.error('Error loading web component:', err)
      }
    }

    loadComponent()
  }, [])

  return (
    <div className='map-container' style={{ width: '100%', height: '80vh' }}>
      {componentLoaded ? (
        <destinations-map />
      ) : (
        <div className='loading-container'>
          <p>Loading 3D map...</p>
        </div>
      )}
    </div>
  )
}

// Use next/dynamic to create a client-only component
const DynamicMapComponent = dynamic(
  () => Promise.resolve(WebComponentContainer),
  { ssr: false }
)

const MapWrapper: React.FC = () => {
  return <DynamicMapComponent />
}

export default MapWrapper
