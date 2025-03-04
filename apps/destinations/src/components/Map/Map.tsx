/* eslint-disable react/no-unknown-property */
import { Destination } from '@/components/Map/Destination'
import { useDestinations } from '@/providers/DestinationsProvider'
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { DestinationData } from './types'

// Background component to catch clicks on empty space
const BackgroundClickCatcher = () => {
  const { setActiveDestination } = useDestinations()
  const isDragging = useRef(false)
  const mouseDownPos = useRef(new THREE.Vector2())

  // Track mouse down position to determine if it's a drag or click
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    isDragging.current = false
    mouseDownPos.current.set(e.clientX, e.clientY)
  }

  // Track pointer movement to detect dragging
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) {
      // Calculate distance from mousedown position
      const dist = new THREE.Vector2(e.clientX, e.clientY).distanceTo(
        mouseDownPos.current
      )

      // If moved more than 3 pixels, consider it a drag
      if (dist > 3) {
        isDragging.current = true
      }
    }
  }

  // Handle click on empty space only if not dragging
  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) {
      // Only handle as a click if not dragging
      e.stopPropagation()
      setActiveDestination(null)
    }
  }

  return (
    // A large sphere that surrounds the entire scene but is invisible
    // It has the lowest renderOrder to ensure it doesn't block other clickable objects
    <mesh
      renderOrder={-1000}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}>
      {/* Use a large radius to ensure it surrounds everything */}
      <sphereGeometry args={[200, 32, 32]} />
      {/* Transparent material that doesn't show but still captures events */}
      <meshBasicMaterial
        transparent={true}
        opacity={0}
        side={THREE.BackSide} // BackSide so it works from inside the sphere
        depthWrite={false} // Don't write to depth buffer
      />
    </mesh>
  )
}

// Camera controller component
const CameraController = () => {
  const { camera } = useThree()
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const orbitControlsRef = useRef<OrbitControlsImpl>(null)
  const { activeDestination } = useDestinations()

  // Use a ref to track animation state
  const animationState = useRef({
    isAnimating: false,
    startTime: 0,
    duration: 1500, // Slightly longer duration for smoother movement
    startTargetPosition: new THREE.Vector3(),
    endTargetPosition: new THREE.Vector3(),
    startCameraPosition: new THREE.Vector3(),
    endCameraPosition: new THREE.Vector3(),
  })

  // Calculate a good camera position based on the destination
  const calculateCameraPosition = (
    destination: DestinationData
  ): THREE.Vector3 => {
    const destPosition = new THREE.Vector3(
      destination.position[0],
      destination.position[1],
      destination.position[2]
    )

    // The distance depends on the destination size (radius)
    // We want larger destinations to be viewedfrom further away
    const distance = destination.radius * 10 + 3 // Base distance formula

    console.log('distance', distance)

    // Create an offset vector - this places the camera at a slight angle rather than directly on the destination
    // This creates a more interesting perspective
    const offset = new THREE.Vector3(
      (destination.position[0] + 0.01) * -0.2, // Slight offset on X
      (destination.position[1] + 0.01) * -0.3, // Slight offset on Y
      (destination.position[2] + 0.01) * -0.2 // Slight offset on Z
    )
      .normalize()
      .multiplyScalar(distance)

    // The final camera position is the destination position plus the offset
    return destPosition.clone().add(offset)
  }

  // Get default camera position (when no destination is selected)
  const getDefaultCameraPosition = () => {
    return new THREE.Vector3(0, 0, 20)
  }

  // Start a new animation when active destination changes
  useEffect(() => {
    if (!orbitControlsRef.current || !camera) return

    // Set target and camera positions based on whether a destination is active
    const currentTargetPos = new THREE.Vector3().copy(
      orbitControlsRef.current.target
    )
    const currentCameraPos = new THREE.Vector3().copy(camera.position)

    let newTargetPos, newCameraPos

    if (activeDestination) {
      // If we have an active destination, move to it
      newTargetPos = new THREE.Vector3(
        activeDestination.position[0],
        activeDestination.position[1],
        activeDestination.position[2]
      )
      newCameraPos = calculateCameraPosition(activeDestination)
    } else {
      // If no active destination, return to default position
      newTargetPos = new THREE.Vector3(0, 0, 0)
      newCameraPos = getDefaultCameraPosition()
    }

    // Set up animation state
    animationState.current = {
      isAnimating: true,
      startTime: Date.now(),
      duration: 1500,
      startTargetPosition: currentTargetPos,
      endTargetPosition: newTargetPos,
      startCameraPosition: currentCameraPos,
      endCameraPosition: newCameraPos,
    }
  }, [activeDestination, camera])

  // Handle animation in the render loop
  useFrame(() => {
    if (
      !orbitControlsRef.current ||
      !animationState.current.isAnimating ||
      !camera
    )
      return

    const {
      startTime,
      duration,
      startTargetPosition,
      endTargetPosition,
      startCameraPosition,
      endCameraPosition,
      isAnimating,
    } = animationState.current

    if (isAnimating) {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Use easing function for smoother animation (ease out cubic)
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      // Calculate new target position
      const newTargetPos = new THREE.Vector3().lerpVectors(
        startTargetPosition,
        endTargetPosition,
        easedProgress
      )

      // Calculate new camera position
      const newCameraPos = new THREE.Vector3().lerpVectors(
        startCameraPosition,
        endCameraPosition,
        easedProgress
      )

      // Update positions
      orbitControlsRef.current.target.copy(newTargetPos)
      camera.position.copy(newCameraPos)

      // Force controls update
      orbitControlsRef.current.update()

      // Animation complete
      if (progress === 1) {
        animationState.current.isAnimating = false
      }
    }
  })

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0, 20]} // Start a bit further back to see more of the space
        fov={60}
      />
      <OrbitControls
        ref={orbitControlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        enableDamping={true}
        dampingFactor={0.1}
        minDistance={3}
        maxDistance={100}
      />
    </>
  )
}

export const Map = () => {
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
      <Canvas shadows style={canvasStyle}>
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
            color={dest.color || '#ff4400'}
            active={dest.id === activeDestination?.id}
            onClick={() => setActiveDestination(dest)}
          />
        ))}
        <BackgroundClickCatcher />
      </Canvas>
    </div>
  )
}

export default Map
