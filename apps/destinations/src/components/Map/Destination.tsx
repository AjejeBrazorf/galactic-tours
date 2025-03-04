/* eslint-disable react/no-unknown-property */
import {
  Cloud,
  Clouds,
  Html,
  MeshDistortMaterial,
  useTexture,
} from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

interface DestinationProps {
  id: string
  name: string
  position: [number, number, number]
  active: boolean
  radius: number
  texture: {
    color: string
    bump?: string
  }
  emission: number
  color?: string
  onClick: (id: string) => void
}

const Atmosphere = ({
  radius,
  emission,
  color,
}: {
  radius: number
  emission: number
  color: string
}) => {
  const atmosphereRef = useRef<THREE.Mesh>(null)

  return (
    <mesh ref={atmosphereRef}>
      <sphereGeometry args={[radius * 1.15, 32, 32]} />
      <MeshDistortMaterial
        color={color}
        transparent
        opacity={0.03}
        distort={emission / 100 + 0.1}
        speed={0.3}
        side={THREE.FrontSide}
        emissive={color}
        emissiveIntensity={emission / 100}
      />
    </mesh>
  )
}

export const Destination = ({
  id,
  name,
  position,
  color = '#ff0000',
  active = false,
  radius,
  texture,
  emission,
  onClick,
}: DestinationProps) => {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  const planetRef = useRef<THREE.Mesh>(null)

  const rotationSpeed = useMemo(() => Math.random() * 0.01 + 0.1, [id])
  const tiltAngle = useMemo(() => Math.random() * 0.5, [id])

  const props = useTexture({
    map: texture.color,
    aoMap: texture.bump || texture.color,
  })

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (planetRef.current) {
        planetRef.current.rotation.y += rotationSpeed * delta
      }
    }

    if (groupRef.current) {
      const targetScale = active ? 1.5 : hovered ? 1.2 : 1
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      )
    }
  })

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
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
    onClick(id)
  }

  const memoizedClouds = useMemo(
    () => (
      <Clouds raycast={() => null} material={THREE.MeshBasicMaterial}>
        <Cloud
          segments={4}
          scale={6}
          volume={3}
          color={'hotpink'}
          speed={0.3}
          growth={2}
          opacity={0.5}
          bounds={[radius * 2, radius * 2, radius * 2]}
          fade={200}
        />
        <Cloud
          seed={1}
          scale={0.6}
          volume={3}
          color={color}
          speed={0.3}
          growth={2}
          bounds={[radius * 2, radius * 2, radius * 2]}
          fade={300}
        />
      </Clouds>
    ),
    [radius, color]
  )

  return (
    <group position={position}>
      {memoizedClouds}
      <group
        onPointerDown={handleClick}
        onPointerUp={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        ref={groupRef}
        rotation={[tiltAngle, 0, 0]}>
        <mesh ref={planetRef}>
          <sphereGeometry args={[radius, 64, 64]} />
          <meshStandardMaterial
            map={props.map}
            aoMap={props.aoMap}
            aoMapIntensity={props.aoMap ? 1.0 : 0}
            emissive={color}
            emissiveIntensity={emission / 100}
          />
          <Atmosphere radius={radius * 1.2} emission={emission} color={color} />
        </mesh>
      </group>

      <Html distanceFactor={15}>
        <div
          style={{
            width: 'max-content',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            textAlign: 'center',
            transform: 'translateY(-20px)',
            pointerEvents: 'none',
            opacity: hovered ? 1 : 0.1,
            transition: 'opacity 0.2s',
          }}>
          {name}
        </div>
      </Html>
    </group>
  )
}
