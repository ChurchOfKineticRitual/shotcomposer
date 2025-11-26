// DirectorCamera.jsx - The camera being composed with frustum visualization
import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useDirectorCamera } from '../context/SceneContext'

// Frustum visualization for Scene Overview
export function DirectorCameraFrustum() {
  const { camera } = useDirectorCamera()
  const groupRef = useRef()
  const cameraRef = useRef(null)
  const helperRef = useRef(null)
  const isInitializedRef = useRef(false)

  // Create camera and helper on mount
  useEffect(() => {
    if (!groupRef.current) return

    // Skip if already initialized (prevents StrictMode double-creation)
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    // Clear any existing children first (handles HMR edge cases)
    while (groupRef.current.children.length > 0) {
      const child = groupRef.current.children[0]
      groupRef.current.remove(child)
      if (child.dispose) child.dispose()
    }

    // Create a camera object that will be added to the scene graph
    const cam = new THREE.PerspectiveCamera(camera.fov, 16 / 9, 0.5, 12)
    cam.position.set(...camera.position)
    cam.rotation.set(...camera.rotation)
    cameraRef.current = cam

    // Create helper - it will follow its camera's world matrix
    const helper = new THREE.CameraHelper(cam)
    helperRef.current = helper

    // Add both to the group (camera must be in scene graph for world matrix)
    groupRef.current.add(cam)
    groupRef.current.add(helper)

    return () => {
      // Only cleanup if we actually created objects
      if (cameraRef.current && groupRef.current) {
        groupRef.current.remove(cameraRef.current)
      }
      if (helperRef.current) {
        if (groupRef.current) groupRef.current.remove(helperRef.current)
        helperRef.current.dispose()
      }
      cameraRef.current = null
      helperRef.current = null
      isInitializedRef.current = false
    }
  }, [])

  // Update camera properties when state changes
  useFrame(() => {
    if (cameraRef.current && helperRef.current) {
      const cam = cameraRef.current
      cam.position.set(...camera.position)
      cam.rotation.set(...camera.rotation)
      cam.fov = camera.fov
      cam.updateProjectionMatrix()
      cam.updateMatrixWorld(true) // Force world matrix update
      helperRef.current.update()
    }
  })

  return <group ref={groupRef} />
}

// The actual director camera used for rendering Director's Frame
export function DirectorCameraView() {
  const { camera } = useDirectorCamera()
  const cameraRef = useRef()
  const { set } = useThree()

  useEffect(() => {
    if (cameraRef.current) {
      set({ camera: cameraRef.current })
    }
  }, [set])

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(...camera.position)
      cameraRef.current.rotation.set(...camera.rotation)
      cameraRef.current.fov = camera.fov
      cameraRef.current.updateProjectionMatrix()
    }
  })

  return (
    <perspectiveCamera
      ref={cameraRef}
      fov={camera.fov}
      aspect={16 / 9}
      near={0.1}
      far={1000}
      position={camera.position}
      rotation={camera.rotation}
    />
  )
}

export default function DirectorCamera() {
  return null
}
