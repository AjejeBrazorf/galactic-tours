import type ReactDOM from 'react-dom/client'
import { createRoot } from 'react-dom/client'

import Map from '../components/Map'

// Import specific functions or components from libraries instead of bare imports
// These imports ensure the libraries are included in the bundle

// Copy any styles needed for the Map component
const styles = `
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }
  div {
    width: 100%;
    height: 100%;
  }
`

// Create a self-contained web component with its own React instance
class DestinationsMap extends HTMLElement {
  private root: ReactDOM.Root | null = null
  private shadowContainer: HTMLDivElement | null = null

  connectedCallback() {
    try {
      // Create shadow DOM for isolation
      const shadow = this.attachShadow({ mode: 'open' })

      // Add styles to shadow DOM
      const styleElement = document.createElement('style')
      styleElement.textContent = styles
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
          this.root.render(<Map />)
          console.debug('Destinations map component rendered successfully')
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
        this.shadowContainer = null
        console.debug('Destinations map component unmounted')
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
