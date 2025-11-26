// useMannequin.js - Mannequin.js integration hook

import { useEffect, useRef } from 'react'
import { Male } from 'mannequin-js/src/bodies/Male.js'
import { Female } from 'mannequin-js/src/bodies/Female.js'
import { scene as mannequinScene, renderer as mannequinRenderer } from 'mannequin-js/src/scene.js'

// Cleanup mannequin.js's auto-created renderer and scene
function cleanupMannequinGlobals() {
  // Remove mannequin.js's canvas from DOM if it exists
  if (mannequinRenderer?.domElement?.parentNode) {
    mannequinRenderer.domElement.parentNode.removeChild(mannequinRenderer.domElement)
  }
  // Stop the animation loop
  mannequinRenderer?.setAnimationLoop(null)
  // Clear any existing objects from mannequin.js's internal scene
  while (mannequinScene.children.length > 0) {
    mannequinScene.remove(mannequinScene.children[0])
  }
}

// Run cleanup on initial load
if (typeof document !== 'undefined') {
  setTimeout(cleanupMannequinGlobals, 0)
}

// Handle Vite HMR - re-run cleanup when module is hot-reloaded
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    cleanupMannequinGlobals()
  })
}

/**
 * Hook for managing Mannequin.js figure lifecycle and pose application
 * @param {string} figureType - 'male' or 'female'
 * @returns {{ mannequinRef: React.MutableRefObject, groupRef: React.MutableRefObject, applyPose: Function }}
 */
export function useMannequin(figureType = 'male') {
  const mannequinRef = useRef(null)
  const groupRef = useRef(null)
  const isInitializedRef = useRef(false)

  // Create mannequin on mount, cleanup on unmount
  useEffect(() => {
    if (!groupRef.current) return

    // Skip if already initialized (prevents StrictMode double-creation)
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    // Clear any existing children first (handles HMR edge cases)
    while (groupRef.current.children.length > 0) {
      groupRef.current.remove(groupRef.current.children[0])
    }

    // Create the appropriate figure type
    const figure = figureType === 'female' ? new Female() : new Male()
    mannequinRef.current = figure

    // Remove from mannequin.js's internal scene (it auto-adds itself there)
    mannequinScene.remove(figure)

    // Add the figure to our R3F group
    groupRef.current.add(figure)

    // Cleanup: remove figure on unmount
    return () => {
      if (groupRef.current && mannequinRef.current) {
        groupRef.current.remove(mannequinRef.current)
      }
      mannequinRef.current = null
      isInitializedRef.current = false
    }
  }, [figureType]) // Recreate if figure type changes

  /**
   * Apply a pose to the mannequin
   * @param {Object} pose - Pose object with body parts as keys
   */
  const applyPose = (pose) => {
    if (!mannequinRef.current || !pose) return

    const mannequin = mannequinRef.current

    // All possible body parts that can be posed
    const parts = [
      'body',
      'head',
      'torso',
      'pelvis',
      'neck',
      'l_arm',
      'l_elbow',
      'l_wrist',
      'l_fingers',
      'r_arm',
      'r_elbow',
      'r_wrist',
      'r_fingers',
      'l_leg',
      'l_knee',
      'l_ankle',
      'r_leg',
      'r_knee',
      'r_ankle'
    ]

    // Apply pose properties to each body part
    parts.forEach((part) => {
      if (pose[part] && mannequin[part]) {
        Object.entries(pose[part]).forEach(([prop, value]) => {
          if (mannequin[part][prop] !== undefined) {
            mannequin[part][prop] = value
          }
        })
      }
    })
  }

  return { mannequinRef, groupRef, applyPose }
}
