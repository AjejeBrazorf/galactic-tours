'use client'
/* eslint-disable react/no-unknown-property */
import { OrbitControls, Sphere, Text } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

import destinations from '../../data/destinations.json'

type DestinationType = {
  id: number
  name: string
  position: [number, number, number]
  color: string
  radius: number
  description: string
}

const Destination = ({ destination }: { destination: DestinationType }) => {
  const { name, position, color, radius, description } = destination
  const sphereRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.005
    }
  })
  return (
    <group position={new THREE.Vector3(...position)}>
      <Sphere
        ref={sphereRef}
        args={[radius, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}>
        <meshStandardMaterial color={color} />
      </Sphere>
      {hovered && (
        <Text
          position={[0, radius + 0.3, 0]}
          fontSize={0.2}
          color='white'
          strokeColor='white'
          anchorX='center'
          anchorY='middle'>
          {name}
          {'\n'}
          {description}
        </Text>
      )}
    </group>
  )
}

export const Map = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls />
        {(destinations as DestinationType[]).map((destination) => (
          <Destination key={destination.id} destination={destination} />
        ))}
      </Canvas>
    </div>
  )
}

export default Map
