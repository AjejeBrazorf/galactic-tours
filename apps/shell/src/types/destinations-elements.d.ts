// Declare the destinations-map web component for TypeScript
declare namespace JSX {
  interface IntrinsicElements {
    'destinations-map': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >
  }
}

// Declare the destinations module
declare module 'destinations/dist/index.js' {
  export const DestinationsMap: typeof HTMLElement
}
