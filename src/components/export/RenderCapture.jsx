// RenderCapture.jsx - In-Canvas component for capturing PNG from director camera
import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useRenderCapture } from '../../context/RenderCaptureContext'
import { useDirectorCamera } from '../../context/SceneContext'

export default function RenderCapture() {
  const { gl, scene } = useThree()
  const { camera: cameraState } = useDirectorCamera()
  const { registerCaptureFunction } = useRenderCapture()
  const directorCameraRef = useRef(null)

  // Create a dedicated camera for capture
  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(
      cameraState.fov,
      16 / 9,
      0.1,
      1000
    )
    directorCameraRef.current = camera

    return () => {
      directorCameraRef.current = null
    }
  }, [])

  // Register the capture function
  useEffect(() => {
    const captureFunction = async (width, height) => {
      if (!directorCameraRef.current) {
        throw new Error('Director camera not initialized')
      }

      const camera = directorCameraRef.current

      // Update camera with current state
      camera.position.set(...cameraState.position)
      camera.rotation.set(...cameraState.rotation)
      camera.fov = cameraState.fov
      camera.aspect = width / height
      camera.updateProjectionMatrix()

      // Store original renderer size
      const originalSize = new THREE.Vector2()
      gl.getSize(originalSize)

      // Store original pixel ratio
      const originalPixelRatio = gl.getPixelRatio()

      // Set high-quality render settings
      gl.setPixelRatio(1) // Use 1:1 pixel ratio for clean output
      gl.setSize(width, height, false) // Don't update style

      // Render the scene from the director camera
      gl.render(scene, camera)

      // Capture canvas data
      const dataURL = gl.domElement.toDataURL('image/png')

      // Restore original renderer settings
      gl.setSize(originalSize.x, originalSize.y, false)
      gl.setPixelRatio(originalPixelRatio)

      // Force a render to restore the normal view
      gl.render(scene, camera)

      // Download the image
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      link.download = `shot-${timestamp}.png`
      link.href = dataURL
      link.click()

      return dataURL
    }

    registerCaptureFunction(captureFunction)
  }, [gl, scene, registerCaptureFunction, cameraState])

  return null
}
