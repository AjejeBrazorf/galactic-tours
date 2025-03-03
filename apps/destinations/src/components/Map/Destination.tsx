/* eslint-disable react/no-unknown-property */
import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import type * as THREE from 'three'

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

    // Call the regular onClick handler
    onClick(id)

    // Directly communicate with the parent window
    if (typeof window !== 'undefined' && window.parent !== window) {
      console.debug(
        `Directly sending destination click message to parent for: ${name}`
      )

      try {
        // Send the data directly to the parent window
        window.parent.postMessage(
          {
            type: 'DIRECT_DESTINATION_SELECTED',
            payload: {
              id: id,
              name: name,
              position: position,
              coordinates: {
                x: position[0],
                y: position[1],
                z: position[2],
              },
              // Add more properties as needed
              color: color,
              timestamp: new Date().toISOString(),
            },
          },
          '*'
        )
        console.debug('Direct message sent successfully')
      } catch (error) {
        console.error('Error sending direct message to parent:', error)
      }
    }
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
      <meshStandardMaterial color={active || hovered ? '#ffffff' : color} />

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
