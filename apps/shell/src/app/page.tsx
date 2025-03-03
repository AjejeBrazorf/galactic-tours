'use client'

import React, { useEffect, useRef, useState } from 'react'

import styles from './page.module.scss'

// Define the types for the destination data
interface Coordinates {
  x: number
  y: number
  z: number
}

interface DestinationData {
  id: string | number
  name: string
  coordinates?: Coordinates
  position?: [number, number, number]
  description?: string
  color?: string
  timestamp?: string
}

const Home: React.FC = () => {
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationData | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [messageCount, setMessageCount] = useState(0)

  // Set up message listener for communications from the destinations app
  useEffect(() => {
    console.debug('Setting up message listener in shell app')

    const handleMessage = (event: MessageEvent) => {
      // Increment message count for debugging
      setMessageCount((prev) => prev + 1)
      console.debug(`Message received (${messageCount + 1}):`, event)

      // Process all messages, regardless of source for debugging
      if (event.data && typeof event.data === 'object') {
        console.debug('Message data type:', event.data.type)

        // Handle regular message
        if (event.data.type === 'DESTINATION_SELECTED') {
          console.debug('Destination selected:', event.data.payload)
          setSelectedDestination(event.data.payload)
          return
        }

        // Handle direct message
        if (event.data.type === 'DIRECT_DESTINATION_SELECTED') {
          console.debug('Direct destination selected:', event.data.payload)
          setSelectedDestination(event.data.payload)
          return
        }
      }

      // For debugging purposes, log when we receive a message that doesn't match
      if (
        iframeRef.current &&
        event.source === iframeRef.current.contentWindow
      ) {
        console.debug(
          'Message from iframe but not matching expected format:',
          event.data
        )
      }
    }

    // Add event listener - use the "message" event which works across domains
    window.addEventListener('message', handleMessage)

    // Cleanup
    return () => {
      console.debug('Removing message listener')
      window.removeEventListener('message', handleMessage)
    }
  }, [messageCount])

  // Send a test message to the iframe once it's loaded
  const handleIframeLoad = () => {
    console.debug('Iframe loaded')
    setIframeLoaded(true)

    // Wait a second to make sure iframe is fully initialized
    setTimeout(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        console.debug('Sending test message to iframe')
        try {
          iframeRef.current.contentWindow.postMessage(
            { type: 'SHELL_READY' },
            '*'
          )
          console.debug('Test message sent to iframe')
        } catch (error) {
          console.error('Error sending test message:', error)
        }
      }
    }, 1000)
  }

  return (
    <div className={styles.root}>
      <h1>Galactic Tours Explorer</h1>

      <div className={styles.mainContent}>
        <div className={styles.mapContainer}>
          <iframe
            ref={iframeRef}
            src='http://localhost:5173'
            title='Destinations Map'
            onLoad={handleIframeLoad}
            style={{
              width: '100%',
              height: '600px',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
            allow='autoplay; fullscreen; accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi'
          />
        </div>

        {selectedDestination && (
          <div className={styles.destinationInfo}>
            <h2>{selectedDestination.name}</h2>
            <p>
              <strong>Coordinates:</strong>
              {selectedDestination.coordinates ? (
                <span>
                  X: {selectedDestination.coordinates.x}, Y:{' '}
                  {selectedDestination.coordinates.y}, Z:{' '}
                  {selectedDestination.coordinates.z}
                </span>
              ) : selectedDestination.position ? (
                <span>
                  X: {selectedDestination.position[0]}, Y:{' '}
                  {selectedDestination.position[1]}, Z:{' '}
                  {selectedDestination.position[2]}
                </span>
              ) : (
                <span>Not available</span>
              )}
            </p>
            {selectedDestination.description && (
              <p>
                <strong>Description:</strong> {selectedDestination.description}
              </p>
            )}
            {selectedDestination.timestamp && (
              <p>
                <small>
                  Selected at:{' '}
                  {new Date(selectedDestination.timestamp).toLocaleTimeString()}
                </small>
              </p>
            )}
          </div>
        )}
      </div>

      <div className={styles.debugInfo}>
        <p>
          <strong>Debug Status:</strong>{' '}
          {iframeLoaded ? 'Iframe Loaded' : 'Iframe Loading...'}
        </p>
        <p>
          <strong>Messages Received:</strong> {messageCount}
        </p>
        <button
          onClick={() => {
            console.debug('Current iframe ref:', iframeRef.current)
            if (iframeRef.current && iframeRef.current.contentWindow) {
              console.debug('Manually sending test message to iframe')
              iframeRef.current.contentWindow.postMessage(
                { type: 'TEST_FROM_SHELL' },
                '*'
              )
            }
          }}
          className={styles.debugButton}>
          Send Test Message
        </button>
      </div>
    </div>
  )
}

export default Home
