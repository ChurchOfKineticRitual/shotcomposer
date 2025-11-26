// useKeyboardControls.js - Keyboard controls for camera movement
import { useEffect, useRef, useCallback } from 'react'
import { useDirectorCamera } from '../context/SceneContext'

// Base speeds - Alt modifier reduces these to 10%
const MOVE_SPEED = 0.1
const ROTATE_SPEED = 0.02
const HEIGHT_SPEED = 0.1
const FINE_MODIFIER = 0.1 // Alt key multiplier for fine adjustments

export function useKeyboardControls(isActive) {
  const { camera, setPosition, setRotation } = useDirectorCamera()
  const keysPressed = useRef(new Set())
  const altPressed = useRef(false)

  // Handle key down
  const handleKeyDown = useCallback((e) => {
    if (!isActive) return

    const key = e.key.toLowerCase()

    // Track Alt modifier
    if (e.altKey) {
      altPressed.current = true
    }

    // Prevent default for arrow keys to avoid page scrolling
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      e.preventDefault()
    }

    keysPressed.current.add(key)
  }, [isActive])

  // Handle key up
  const handleKeyUp = useCallback((e) => {
    keysPressed.current.delete(e.key.toLowerCase())
    // Update Alt state
    if (!e.altKey) {
      altPressed.current = false
    }
  }, [])

  // Update camera based on keys pressed
  const updateCamera = useCallback(() => {
    if (!isActive || keysPressed.current.size === 0) return

    const keys = keysPressed.current
    let [x, y, z] = camera.position
    let [rotX, rotY, rotZ] = camera.rotation

    // Apply fine modifier if Alt is held
    const speedMod = altPressed.current ? FINE_MODIFIER : 1
    const moveSpeed = MOVE_SPEED * speedMod
    const rotateSpeed = ROTATE_SPEED * speedMod
    const heightSpeed = HEIGHT_SPEED * speedMod

    // Calculate forward/right vectors based on Y rotation
    const cosY = Math.cos(rotY)
    const sinY = Math.sin(rotY)

    // Forward/backward (W/S) - position movement
    if (keys.has('w')) {
      x -= sinY * moveSpeed
      z -= cosY * moveSpeed
    }
    if (keys.has('s')) {
      x += sinY * moveSpeed
      z += cosY * moveSpeed
    }

    // Strafe left/right (A/D) - position movement
    if (keys.has('a')) {
      x -= cosY * moveSpeed
      z += sinY * moveSpeed
    }
    if (keys.has('d')) {
      x += cosY * moveSpeed
      z -= sinY * moveSpeed
    }

    // Height (Q down, E up)
    if (keys.has('q')) {
      y -= heightSpeed
    }
    if (keys.has('e')) {
      y += heightSpeed
    }

    // Rotation with Arrow keys (Up/Down = tilt/pitch, Left/Right = pan/yaw)
    if (keys.has('arrowup')) {
      rotX = Math.max(-Math.PI / 2, rotX - rotateSpeed)
    }
    if (keys.has('arrowdown')) {
      rotX = Math.min(Math.PI / 2, rotX + rotateSpeed)
    }
    if (keys.has('arrowleft')) {
      rotY += rotateSpeed
    }
    if (keys.has('arrowright')) {
      rotY -= rotateSpeed
    }

    // Clamp height to reasonable range (floor constraint)
    y = Math.max(0.05, Math.min(10, y))

    // Update state if changed
    if (x !== camera.position[0] || y !== camera.position[1] || z !== camera.position[2]) {
      setPosition([x, y, z])
    }
    if (rotX !== camera.rotation[0] || rotY !== camera.rotation[1]) {
      setRotation([rotX, rotY, rotZ])
    }
  }, [isActive, camera, setPosition, setRotation])

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  // Animation loop for smooth movement
  useEffect(() => {
    if (!isActive) return

    let animationId
    const animate = () => {
      updateCamera()
      animationId = requestAnimationFrame(animate)
    }
    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isActive, updateCamera])

  return {
    isMoving: keysPressed.current.size > 0
  }
}
