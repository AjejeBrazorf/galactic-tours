import type { ReactThreeFiber } from '@react-three/fiber'
import type * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>
      ambientLight: ReactThreeFiber.LightNode<
        THREE.AmbientLight,
        typeof THREE.AmbientLight
      >
      pointLight: ReactThreeFiber.LightNode<
        THREE.PointLight,
        typeof THREE.PointLight
      >
      meshStandardMaterial: ReactThreeFiber.MaterialNode<
        THREE.MeshStandardMaterial,
        typeof THREE.MeshStandardMaterial
      >
    }
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    orbitControls: ReactThreeFiber.Object3DNode<
      OrbitControlsImpl,
      typeof OrbitControlsImpl
    >
  }
}
