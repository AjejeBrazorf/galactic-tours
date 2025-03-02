'use client'
/* eslint-disable react/no-unknown-property */
import { Html, OrbitControls, Stars } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { Canvas, useFrame } from '@react-three/fiber'
import React, { useRef, useState } from 'react'
import type * as THREE from 'three'

import destinations from '../../data/destinations.json'

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id,
  name,
  position,
  color = '#ff0000',
}) => {
  const mesh = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  // Animation on hover
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01
    }
  })

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    setActive(!active)
  }

  // Calculate the actual color to use based on hover/active state
  const sphereColor = active ? '#ffffff' : hovered ? '#ff8a00' : color

  // Define inline styles for the label
  const labelStyle = {
    fontSize: '12px',
    padding: '2px 6px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    borderRadius: '4px',
    pointerEvents: 'none' as const,
    whiteSpace: 'nowrap' as const,
    height: '2.6ch',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 'fit-content',
    position: 'absolute' as const,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  }

  return (
    <mesh
      position={position}
      ref={mesh}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={hovered ? 1.2 : 1}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color={sphereColor} />
      {(active || hovered) && (
        <Html position={[0, 1.5, 0]} center>
          <div style={labelStyle}>{name}</div>
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
interface MapProps {
  isWebComponent?: boolean
}

const Map: React.FC<MapProps> = ({ isWebComponent = false }) => {
  // Safe initialization with environment check
  const canvasStyle = {
    width: '100%',
    height: '100%',
    background: isWebComponent
      ? 'transparent'
      : 'linear-gradient(to bottom, #1e1e2f, #2d2d44)',
  }

  // Use the isWebComponent prop to customize the component behavior in web component context
  const renderMap = () => (
    <Canvas
      camera={{ position: [0, 10, 25], fov: 60 }}
      style={canvasStyle}
      shadows>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />

      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={isWebComponent ? 3000 : 5000}
        factor={4}
      />

      {/* Destinations from data */}
      {destinations.map((dest: DestinationData) => (
        <Destination
          key={dest.id}
          id={dest.id.toString()}
          name={dest.name}
          position={dest.position as [number, number, number]}
          color={dest.color}
        />
      ))}

      {/* Orbit controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={isWebComponent ? false : true}
        enableRotate={true}
        zoomSpeed={0.6}
        panSpeed={0.5}
        rotateSpeed={0.4}
      />
    </Canvas>
  )

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {isBrowser ? renderMap() : <div>Loading 3D map...</div>}
    </div>
  )
}

export default Map
