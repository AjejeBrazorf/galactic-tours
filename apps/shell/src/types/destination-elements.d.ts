// Type definitions for the destinations-map web component

// Extend HTMLElement for the custom element
type DestinationsMapElement = HTMLElement

// Declare the custom element for the DOM
declare global {
  interface HTMLElementTagNameMap {
    'destinations-map': DestinationsMapElement
  }
}

// Declare the custom element for JSX
declare namespace JSX {
  interface IntrinsicElements {
    'destinations-map': React.DetailedHTMLProps<
      React.HTMLAttributes<DestinationsMapElement>,
      DestinationsMapElement
    >
  }
}

export {}
