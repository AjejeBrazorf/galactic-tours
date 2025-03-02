# Destinations App

This app uses React Three Fiber to render a 3D map of galactic destinations.

## React Version Compatibility

There's currently a compatibility issue between React 19 (used in the shell app) and React Three Fiber (which works best with React 18).

### How to Fix

To integrate this app with the shell app, follow these steps:

1. **Ensure consistent React versions**: Both apps should use the same React version. Either:

   - Downgrade the shell app to React 18.x
   - Wait for React Three Fiber to be compatible with React 19

2. **Use dynamic imports with SSR disabled**: When importing the Map component in the shell app:

   ```tsx
   // In a component file in the shell app
   'use client'
   import dynamic from 'next/dynamic'

   const MapComponent = dynamic(
     () => import('destinations/src/components/Map'),
     {
       ssr: false,
     }
   )

   export const MapWrapper = () => {
     return (
       <div style={{ width: '100%', height: '80vh' }}>
         <MapComponent />
       </div>
     )
   }
   ```

3. **Configure Next.js properly**: Use JavaScript config files (next.config.js) instead of TypeScript, and include:

   ```js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     // ... other config
     experimental: {
       esmExternals: 'loose', // Helps with three.js compatibility
     },
   }
   ```

4. **Add proper TypeScript declarations**: Create a types file (e.g., `src/types/three-fiber.d.ts`) with:

   ```ts
   import { ReactThreeFiber } from '@react-three/fiber'
   import * as THREE from 'three'
   import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

   declare global {
     namespace JSX {
       interface IntrinsicElements {
         group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>
         ambientLight: ReactThreeFiber.LightNode<
           THREE.AmbientLight,
           typeof THREE.AmbientLight
         >
         pointLight: ReactThreeFiber.LightNode<
           THREE.PointLight,
           typeof THREE.PointLight
         >
         meshStandardMaterial: ReactThreeFiber.MaterialNode<
           THREE.MeshStandardMaterial,
           typeof THREE.MeshStandardMaterial
         >
       }
     }
   }

   declare module '@react-three/fiber' {
     interface ThreeElements {
       orbitControls: ReactThreeFiber.Object3DNode<
         OrbitControlsImpl,
         typeof OrbitControlsImpl
       >
     }
   }
   ```

## Development

To run this app in development mode:

```bash
pnpm run dev
```

## Building

To build this app:

```bash
pnpm run build
```
