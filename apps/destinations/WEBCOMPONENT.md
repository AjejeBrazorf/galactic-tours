# Destinations Web Component

This document explains how to build and use the Destinations Map as a web component in other applications, including the shell app in this monorepo.

## Building the Web Component

To build the web component:

```bash
# Navigate to the destinations app
cd apps/destinations

# Install dependencies if needed
pnpm install

# Build the web component
pnpm run build:wc
```

This will compile the component into the `dist` directory.

## Using the Web Component in the Shell App

The web component is designed to work independently of the shell app's React version. It can be used with React 19 even though internally it uses React 18, thanks to the web component isolation.

### In React 19 Application (Shell)

1. Make sure the destinations app is added as a dependency in your package.json:

```json
{
  "dependencies": {
    "destinations": "workspace:*"
  }
}
```

2. Create a type declaration file for the custom element in your app:

```typescript
// src/types/destinations-elements.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'destinations-map': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >
  }
}

declare module 'destinations/dist/index.js' {
  export const DestinationsMap: typeof HTMLElement
}
```

3. Create a wrapper component to load and use the web component:

```tsx
'use client'

import React, { useEffect, useState } from 'react'

const MapWrapper: React.FC = () => {
  const [isComponentLoaded, setIsComponentLoaded] = useState(false)

  useEffect(() => {
    // Check if the component is already defined
    if (customElements.get('destinations-map')) {
      setIsComponentLoaded(true)
      return
    }

    // Dynamic import of the web component
    import('destinations/dist/index.js')
      .then(() => {
        setIsComponentLoaded(true)
      })
      .catch((err) => {
        console.error('Failed to load destinations component:', err)
      })
  }, [])

  return (
    <div style={{ width: '100%', height: '80vh' }}>
      {isComponentLoaded ? (
        // @ts-expect-error - TypeScript doesn't understand web components well
        <destinations-map />
      ) : (
        <div>Loading Destinations Map...</div>
      )}
    </div>
  )
}

export default MapWrapper
```

4. Use it in your app with dynamic import to avoid SSR issues:

```tsx
import dynamic from 'next/dynamic'

const DynamicMapWrapper = dynamic(() => import('./MapWrapper'), {
  ssr: false,
  loading: () => <div>Loading Map Component...</div>,
})

const MyComponent = () => {
  return (
    <div>
      <h1>Galactic Destinations</h1>
      <DynamicMapWrapper />
    </div>
  )
}
```

## How it Works

The destinations web component uses Shadow DOM to isolate itself from the parent application. This means:

1. CSS styles don't leak in either direction
2. The React 18 instance inside the component doesn't conflict with React 19 in the shell
3. The component can be used in any framework, not just React

This approach allows you to maintain independent teams working on different parts of your application while still providing a cohesive user experience.
