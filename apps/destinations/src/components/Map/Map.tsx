/* eslint-disable react/no-unknown-property */
import { OrbitControls, Stars } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

import { useDestinations } from './hooks/useDestinations'
import type { DestinationData } from './types'

import { Destination } from '@/components/Map/Destination'

const Map = () => {
  const { destinations, activeDestination, handleDestinationClick } =
    useDestinations()

  const canvasStyle = {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, #1e1e2f, #2d2d44)',
  }
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 10, 25], fov: 60 }}
        style={canvasStyle}
        shadows>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />

        <Stars radius={100} depth={50} count={5000} factor={4} />

        {destinations.map((dest: DestinationData) => (
          <Destination
            key={dest.id}
            id={dest.id.toString()}
            name={dest.name}
            position={dest.position as [number, number, number]}
            color={dest.color || '#ff4400'}
            active={dest.id === activeDestination?.id}
            onClick={handleDestinationClick}
          />
        ))}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
    </div>
  )
}

export default Map
