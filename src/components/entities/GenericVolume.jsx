// GenericVolume.jsx - Simple geometric volume with optional facing indicator

import * as THREE from 'three';
import FacingIndicator from './FacingIndicator';

/**
 * GenericVolume - Represents non-human entities with simple geometric volumes
 *
 * Used for animals, props, vehicles, and other scene objects
 * Supports box or sphere shapes with custom dimensions
 *
 * @param {string} shape - 'box' or 'sphere'
 * @param {Object} dimensions - { width, height, depth } for sizing
 * @param {boolean} showBeak - Whether to show facing indicator
 * @param {string} label - Display label (used for prompt generation)
 * @param {number} facing - Rotation in degrees (Y axis)
 * @param {[number, number, number]} position - World position [x, y, z]
 * @param {function} onClick - Click handler for selection
 * @param {boolean} selected - Whether this entity is currently selected
 */
export default function GenericVolume({
  shape = 'box',
  dimensions = { width: 1, height: 1, depth: 1 },
  showBeak = true,
  label = 'Object',
  facing = 0,
  position = [0, 0, 0],
  onClick,
  selected = false
}) {
  const { width = 1, height = 1, depth = 1 } = dimensions;

  // For sphere, use average of dimensions as diameter
  const sphereRadius = (width + height + depth) / 6;

  return (
    <group
      position={position}
      rotation={[0, THREE.MathUtils.degToRad(facing), 0]}
      onClick={onClick}
    >
      {/* Volume mesh */}
      <mesh>
        {shape === 'box' ? (
          <boxGeometry args={[width, height, depth]} />
        ) : (
          <sphereGeometry args={[sphereRadius, 16, 16]} />
        )}
        <meshStandardMaterial
          color={selected ? '#fbbf24' : '#6b7280'}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Optional facing indicator ("beak") */}
      {showBeak && (
        <FacingIndicator
          position={[0, 0, shape === 'box' ? depth / 2 + 0.15 : sphereRadius + 0.15]}
        />
      )}
    </group>
  );
}
