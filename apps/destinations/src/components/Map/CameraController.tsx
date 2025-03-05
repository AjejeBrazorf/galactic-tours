import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

import type { DestinationData } from './types'

import { useDestinations } from '@/providers/DestinationsProvider'

export const CameraController = () => {
  const { camera } = useThree()
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const orbitControlsRef = useRef<OrbitControlsImpl>(null)
  const { activeDestination } = useDestinations()

  const animationState = useRef({
    isAnimating: false,
    startTime: 0,
    duration: 1500,
    startTargetPosition: new THREE.Vector3(),
    endTargetPosition: new THREE.Vector3(),
    startCameraPosition: new THREE.Vector3(),
    endCameraPosition: new THREE.Vector3(),
  })

  const calculateCameraPosition = (
    destination: DestinationData
  ): THREE.Vector3 => {
    const destPosition = new THREE.Vector3(
      destination.position[0],
      destination.position[1],
      destination.position[2]
    )

    const distance = destination.radius * 10 + 3
    const offset = new THREE.Vector3(
      (destination.position[0] + 0.01) * -0.2,
      (destination.position[1] + 0.01) * -0.3,
      (destination.position[2] + 0.01) * -0.2
    )
      .normalize()
      .multiplyScalar(distance)

    return destPosition.clone().add(offset)
  }

  const getDefaultCameraPosition = () => {
    return new THREE.Vector3(0, 0, 20)
  }

  useEffect(() => {
    if (!orbitControlsRef.current || !camera) return

    const currentTargetPos = new THREE.Vector3().copy(
      orbitControlsRef.current.target
    )
    const currentCameraPos = new THREE.Vector3().copy(camera.position)

    let newTargetPos, newCameraPos

    if (activeDestination) {
      newTargetPos = new THREE.Vector3(
        activeDestination.position[0],
        activeDestination.position[1],
        activeDestination.position[2]
      )
      newCameraPos = calculateCameraPosition(activeDestination)
    } else {
      newTargetPos = new THREE.Vector3(0, 0, 0)
      newCameraPos = getDefaultCameraPosition()
    }

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

      const easedProgress = 1 - Math.pow(1 - progress, 3)

      const newTargetPos = new THREE.Vector3().lerpVectors(
        startTargetPosition,
        endTargetPosition,
        easedProgress
      )

      const newCameraPos = new THREE.Vector3().lerpVectors(
        startCameraPosition,
        endCameraPosition,
        easedProgress
      )

      orbitControlsRef.current.target.copy(newTargetPos)
      camera.position.copy(newCameraPos)

      orbitControlsRef.current.update()

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
        position={[0, 0, 20]}
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
