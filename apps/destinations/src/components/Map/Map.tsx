/* eslint-disable react/no-unknown-property */
import { OrbitControls, Stars } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

import { useDestinations } from '@/providers/DestinationsProvider'
import type { DestinationData } from './types'

import { Destination } from '@/components/Map/Destination'

const Map = () => {
  const { destinations, activeDestination, setActiveDestination } =
    useDestinations()

  const canvasStyle = {
    padding: '0',
    margin: '0',
    height: '100vh',
    width: '100%',
    background:
      'radial-gradient(circle, rgb(17, 14, 72), rgb(34, 4, 47) 19%, var(--background) 60%)',
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={canvasStyle}
        shadows>
        <ambientLight intensity={0.5} />
        <pointLight position={[1, 2, 1]} intensity={30} castShadow />

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
            position={dest.position as [number, number, number]}
            color={dest.color || '#ff4400'}
            active={dest.id === activeDestination?.id}
            onClick={() => setActiveDestination(dest)}
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
