/* eslint-disable react/no-unknown-property */
import { Html, OrbitControls, Stars } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { Canvas, useFrame } from '@react-three/fiber'
import React, { useRef, useState } from 'react'
import type * as THREE from 'three'

import destinations from '../data/destinations.json'

// Helper function to safely check for window
const isBrowser = typeof window !== 'undefined'

// Types for component props
interface DestinationProps {
  id: string
  name: string
  position: [number, number, number]
  color?: string
}

// Destination sphere component with hover effects
const Destination: React.FC<DestinationProps> = ({
  id,
  name,
  position,
  color = '#ff0000',
}) => {
  const [hovered, setHovered] = useState(false)
  const sphereRef = useRef<THREE.Mesh>(null)

  // Safe hover handlers that check for browser environment
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (!isBrowser) return
    e.stopPropagation()
    setHovered(true)
    // Only modify cursor if window is defined
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'pointer'
    }
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    if (!isBrowser) return
    e.stopPropagation()
    setHovered(false)
    // Only modify cursor if window is defined
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'auto'
    }
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!isBrowser) return
    e.stopPropagation()
    console.debug(`Selected destination: ${name}`)
  }

  // Animation loop with safety checks
  useFrame(() => {
    if (!sphereRef.current) return

    if (hovered) {
      sphereRef.current.scale.set(1.2, 1.2, 1.2)
    } else {
      sphereRef.current.scale.set(1, 1, 1)
    }
  })

  return (
    <mesh
      ref={sphereRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={hovered ? '#ffffff' : color} />

      {/* Use the Html component from drei for labels */}
      {isBrowser && (
        <Html position={[0, 1.5, 0]} center distanceFactor={10}>
          <div
            key={id}
            style={{
              fontSize: '12px',
              padding: '2px 6px',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
              borderRadius: '4px',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}>
            {name}
          </div>
        </Html>
      )}
    </mesh>
  )
}

// Type-safe interface for our JSON data
interface DestinationData {
  id: number
  name: string
  position: number[]
  color?: string
  radius?: number
  description?: string
}

// Main component
const Map: React.FC = () => {
  // Safe initialization with environment check
  const canvasStyle = {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, #1e1e2f, #2d2d44)',
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {isBrowser ? (
        <Canvas
          camera={{ position: [0, 10, 25], fov: 60 }}
          style={canvasStyle}
          shadows>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />

          {/* Stars background */}
          <Stars radius={100} depth={50} count={5000} factor={4} />

          {/* Destinations from data */}
          {destinations.map((dest: DestinationData) => (
            <Destination
              key={dest.id}
              id={dest.id.toString()}
              name={dest.name}
              position={dest.position as [number, number, number]}
              color={dest.color || '#ff4400'}
            />
          ))}

          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
          />
        </Canvas>
      ) : (
        <div style={canvasStyle}>
          <p style={{ color: 'white', textAlign: 'center', paddingTop: '40%' }}>
            3D map loading...
          </p>
        </div>
      )}
    </div>
  )
}

export default Map
