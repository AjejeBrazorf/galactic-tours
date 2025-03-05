import { Stars } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

import { CameraController } from './CameraController'
import type { DestinationData } from './types'

import { useDestinations } from '@/providers/DestinationsProvider'
import { Destination } from '@/components/Map/Destination'

const BackgroundClickCatcher = () => {
  const { selectDestination: setActiveDestination } = useDestinations()
  const isDragging = useRef(false)
  const mouseDownPos = useRef(new THREE.Vector2())

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    isDragging.current = false
    mouseDownPos.current.set(e.clientX, e.clientY)
  }

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) {
      const dist = new THREE.Vector2(e.clientX, e.clientY).distanceTo(
        mouseDownPos.current
      )

      if (dist > 3) {
        isDragging.current = true
      }
    }
  }

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) {
      e.stopPropagation()
      setActiveDestination(null)
    }
  }

  return (
    <mesh
      renderOrder={-1000}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}>
      <sphereGeometry args={[200, 32, 32]} />
      <meshBasicMaterial
        transparent={true}
        opacity={0}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}

export const Map = () => {
  const {
    destinations,
    activeDestination,
    selectDestination: setActiveDestination,
  } = useDestinations()

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        shadows
        style={{
          padding: 0,
          margin: 0,
          height: '100vh',
          width: '100%',
        }}>
        <CameraController />

        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={300} castShadow />

        <Stars
          fade
          saturation={1}
          radius={100}
          depth={50}
          count={15000}
          factor={4}
        />

        {destinations.map((dest: DestinationData) => (
          <Destination
            key={dest.id}
            id={dest.id.toString()}
            name={dest.name}
            radius={dest.radius}
            emission={dest.emission}
            position={dest.position as [number, number, number]}
            texture={dest.texture}
            color={dest.color}
            active={dest.id === activeDestination?.id}
            onClick={() => setActiveDestination(dest.id)}
          />
        ))}
        <BackgroundClickCatcher />
      </Canvas>
    </div>
  )
}

export default Map
