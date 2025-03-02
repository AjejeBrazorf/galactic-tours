import React from 'react'
import { createRoot } from 'react-dom/client'
import Map from '../components/Map/Map'

// CSS for base web component structure only
const baseStyles = `
  :host {
    display: block;
    width: 100%;
    height: 100%;
    contain: content;
  }
  div {
    width: 100%;
    height: 100%;
  }
`

// Create a wrapper for the Map component to inject the web component context
const MapWrapper: React.FC = () => {
  return <Map isWebComponent={true} />
}

class DestinationsMap extends HTMLElement {
  private root: ReturnType<typeof createRoot> | null = null
  private shadowContainer: HTMLDivElement | null = null

  connectedCallback() {
    try {
      // Create shadow DOM for isolation
      const shadow = this.attachShadow({ mode: 'open' })

      // Add base styles
      const styleElement = document.createElement('style')
      styleElement.textContent = baseStyles
      shadow.appendChild(styleElement)

      // Create container for React
      this.shadowContainer = document.createElement('div')
      this.shadowContainer.style.width = '100%'
      this.shadowContainer.style.height = '100%'
      shadow.appendChild(this.shadowContainer)

      // Ensure DOM is ready before rendering
      setTimeout(() => {
        if (this.shadowContainer) {
          this.root = createRoot(this.shadowContainer)
          this.root.render(<MapWrapper />)
          console.log('Destinations map component rendered successfully')
        }
      }, 0)
    } catch (error) {
      console.error('Error initializing destinations map:', error)
    }
  }

  disconnectedCallback() {
    try {
      // Clean up React when element is removed
      if (this.root) {
        this.root.unmount()
        this.root = null
        console.log('Destinations map component unmounted')
      }
    } catch (error) {
      console.error('Error unmounting destinations map:', error)
    }
  }
}

// Only define the custom element if it's not already defined
if (typeof window !== 'undefined' && !customElements.get('destinations-map')) {
  customElements.define('destinations-map', DestinationsMap)
}

export { DestinationsMap }
