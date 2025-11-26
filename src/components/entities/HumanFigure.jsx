// HumanFigure.jsx - Wrapper around Mannequin.js

import { useEffect } from 'react'
import * as THREE from 'three'
import { useMannequin } from '../../hooks/useMannequin'

/**
 * HumanFigure component - Posable human figure using Mannequin.js
 * @param {Object} props
 * @param {string} props.figureType - 'male' or 'female'
 * @param {Object} props.pose - Pose object with body parts
 * @param {Array} props.position - [x, y, z] position
 * @param {Array} props.rotation - [x, y, z] rotation in radians
 * @param {string} props.label - Text label to display above figure
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.selected - Whether the figure is selected
 */
export default function HumanFigure({
  figureType = 'male',
  pose = {},
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  label = 'PERSON',
  onClick,
  selected = false
}) {
  const { mannequinRef, groupRef, applyPose } = useMannequin(figureType)

  // Apply pose reactively when pose prop changes
  useEffect(() => {
    applyPose(pose)
  }, [pose, applyPose])

  const handleClick = (e) => {
    e.stopPropagation()
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <group position={position} rotation={rotation} onClick={handleClick}>
      {/* The mannequin will be added to this group by the hook */}
      <group ref={groupRef} />

      {/* Selection ring on ground */}
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.8, 0.85, 32]} />
          <meshBasicMaterial color="#facc15" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Facing indicator - yellow cone pointing forward */}
      <mesh position={[0, 0.05, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.15, 0.4, 8]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>
    </group>
  )
}
