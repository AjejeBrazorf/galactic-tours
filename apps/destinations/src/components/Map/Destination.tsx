/* eslint-disable react/no-unknown-property */
import { Html } from '@react-three/drei'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

interface DestinationProps {
  id: string
  name: string
  position: [number, number, number]
  active: boolean
  color?: string
  onClick: (id: string) => void
}

export const Destination = ({
  id,
  name,
  position,
  color = '#ff0000',
  active = false,
  onClick,
}: DestinationProps) => {
  const [hovered, setHovered] = useState(false)
  const sphereRef = useRef<THREE.Mesh>(null)

  // Safe hover handlers that check for browser environment
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    // Only modify cursor if window is defined
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'pointer'
    }
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(false)
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'auto'
    }
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    console.debug(`Selected destination: ${name}`)
    onClick(id)
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
      position={position as THREE.Vector3Tuple}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={hovered ? '#ffffff' : color} />

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
    </mesh>
  )
}
