/* eslint-disable react/no-unknown-property */
import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useRef, useState } from 'react'
import type * as THREE from 'three'

interface DestinationProps {
  id: string
  name: string
  position: [number, number, number]
  active: boolean
  radius: number
  color?: string
  onClick: (id: string) => void
}

export const Destination = ({
  id,
  name,
  position,
  color = '#ff0000',
  active = false,
  radius,
  onClick,
}: DestinationProps) => {
  const [hovered, setHovered] = useState(false)
  const sphereRef = useRef<THREE.Mesh>(null)
  const geometryRef = useRef<THREE.SphereGeometry>(null)
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'pointer'
    }
    if (!geometryRef.current) return
    geometryRef.current.scale(1.2, 1.2, 1.2)
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(false)
    if (typeof document !== 'undefined') {
      document.body.style.cursor = 'auto'
    }
    if (!geometryRef.current) return
    geometryRef.current.scale(0.8, 0.8, 0.8)
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onClick(id)
  }

  return (
    <mesh
      ref={sphereRef}
      position={position as THREE.Vector3Tuple}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}>
      <sphereGeometry ref={geometryRef} args={[radius, 32, 32]} />
      <meshStandardMaterial color={active || hovered ? '#ffffff' : color} />

      <Html position={[0, radius + 0.2, 0]} center distanceFactor={10}>
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
