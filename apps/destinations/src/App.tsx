import '@repo/ui/theme.css'
import React, { useEffect } from 'react'

import './App.css'
import Map from './components/Map/Map'
import { useDestinations } from './components/Map/hooks/useDestinations'

const App: React.FC = () => {
  const { activeDestination } = useDestinations()

  // Set up listener for messages from the parent window
  useEffect(() => {
    console.debug('Setting up message listener in destinations app')

    const handleMessage = (event: MessageEvent) => {
      console.debug('Destinations app received message:', event.data)

      // Process messages from parent
      if (event.data && event.data.type) {
        console.debug(`Message type: ${event.data.type}`)
      }
    }

    window.addEventListener('message', handleMessage)

    // Check if running in an iframe
    const isIframe = window.parent !== window
    console.debug('Running in iframe:', isIframe)

    // Send a ready message to the parent if in an iframe
    if (isIframe) {
      console.debug('Sending DESTINATIONS_READY message to parent')
      window.parent.postMessage(
        {
          type: 'DESTINATIONS_READY',
        },
        '*'
      )
    }

    return () => {
      console.debug('Removing message listener in destinations app')
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  // Send a message to the parent window when the active destination changes
  useEffect(() => {
    console.debug('Active destination changed:', activeDestination)

    if (activeDestination && window.parent !== window) {
      console.debug('Sending DESTINATION_SELECTED message to parent')

      try {
        console.debug('Sending DESTINATION_SELECTED message to parent')
        window.parent.postMessage(
          {
            type: 'DESTINATION_SELECTED',
            payload: {
              ...activeDestination,
              // Ensure we're sending a serializable object
              position: activeDestination.position
                ? [
                    activeDestination.position[0],
                    activeDestination.position[1],
                    activeDestination.position[2],
                  ]
                : undefined,
              // Add coordinates for the shell app to use
              coordinates: {
                x: activeDestination.position[0],
                y: activeDestination.position[1],
                z: activeDestination.position[2],
              },
            },
          },
          '*'
        )
        console.debug('Message sent successfully')
      } catch (error) {
        console.error('Error sending message to parent:', error)
      }
    }
  }, [activeDestination, window.parent])

  return (
    <div
      style={{
        padding: '0',
        margin: '0',
        height: '100vh',
        width: '100%',
        position: 'relative',
      }}>
      <Map />
      {/* Debug overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '8px',
          fontSize: '12px',
          maxWidth: '300px',
          zIndex: 1000,
        }}>
        <div>In iframe: {window.parent !== window ? 'Yes' : 'No'}</div>
        {activeDestination && <div>Selected: {activeDestination.name}</div>}
      </div>
    </div>
  )
}

export default App
