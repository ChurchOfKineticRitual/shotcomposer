// VolumeControls.jsx - Leva UI for volume properties
import { useControls, folder } from 'leva'
import { useEffect, useRef } from 'react'

/**
 * VolumeControls - Leva-based UI for editing volume entity properties
 *
 * @param {Object} entity - The selected volume entity from SceneContext
 * @param {Function} onVolumeChange - Callback when volume values change
 */
export default function VolumeControls({ entity, onVolumeChange }) {
  if (!entity || entity.type !== 'volume') {
    return null
  }

  return <VolumeControlsInner entity={entity} onVolumeChange={onVolumeChange} />
}

function VolumeControlsInner({ entity, onVolumeChange }) {
  // Track initialization to prevent loop on first render
  const isInitialized = useRef(false)

  // Extract current entity values with defaults
  const shape = entity.shape ?? 'box'
  const dimensions = entity.dimensions ?? { width: 1, height: 1, depth: 1 }
  const showBeak = entity.showBeak ?? true
  const label = entity.label ?? 'Object'
  const posX = entity.position?.[0] ?? 0
  const posY = entity.position?.[1] ?? 0.5
  const posZ = entity.position?.[2] ?? 0
  const facing = entity.facing ?? 0

  // Handler for value changes
  const handleChange = (key, value) => {
    if (!isInitialized.current) return

    let updates = {}

    if (key === 'label') {
      if (entity.label !== value) updates.label = value
    } else if (key === 'shape') {
      if (entity.shape !== value) updates.shape = value
    } else if (key === 'showBeak') {
      if (entity.showBeak !== value) updates.showBeak = value
    } else if (key === 'width' || key === 'height' || key === 'depth') {
      const currentDim = entity.dimensions ?? { width: 1, height: 1, depth: 1 }
      if (currentDim[key] !== value) {
        updates.dimensions = { ...currentDim, [key]: value }
      }
    } else if (key === 'posX' || key === 'posY' || key === 'posZ') {
      const currentPos = entity.position ?? [0, 0.5, 0]
      const newPos = [...currentPos]
      const idx = key === 'posX' ? 0 : key === 'posY' ? 1 : 2
      if (currentPos[idx] !== value) {
        newPos[idx] = value
        updates.position = newPos
      }
    } else if (key === 'facing') {
      if (entity.facing !== value) updates.facing = value
    }

    if (Object.keys(updates).length > 0) {
      onVolumeChange(entity.id, updates)
    }
  }

  // Define Leva controls
  useControls(
    'Volume Editor',
    () => ({
      label: {
        value: label,
        label: 'Label',
        onChange: (v) => handleChange('label', v),
      },
      shape: {
        value: shape,
        options: ['box', 'sphere'],
        label: 'Shape',
        onChange: (v) => handleChange('shape', v),
      },
      showBeak: {
        value: showBeak,
        label: 'Show Beak',
        onChange: (v) => handleChange('showBeak', v),
      },
      dimensions: folder({
        width: {
          value: dimensions.width,
          min: 0.1,
          max: 5,
          step: 0.1,
          label: 'Width',
          onChange: (v) => handleChange('width', v),
        },
        height: {
          value: dimensions.height,
          min: 0.1,
          max: 5,
          step: 0.1,
          label: 'Height',
          onChange: (v) => handleChange('height', v),
        },
        depth: {
          value: dimensions.depth,
          min: 0.1,
          max: 5,
          step: 0.1,
          label: 'Depth',
          onChange: (v) => handleChange('depth', v),
        },
      }),
      position: folder({
        posX: {
          value: posX,
          min: -20,
          max: 20,
          step: 0.1,
          label: 'X',
          onChange: (v) => handleChange('posX', v),
        },
        posY: {
          value: posY,
          min: 0,
          max: 10,
          step: 0.1,
          label: 'Y',
          onChange: (v) => handleChange('posY', v),
        },
        posZ: {
          value: posZ,
          min: -20,
          max: 20,
          step: 0.1,
          label: 'Z',
          onChange: (v) => handleChange('posZ', v),
        },
      }),
      facing: {
        value: facing,
        min: 0,
        max: 360,
        step: 5,
        label: 'Facing (°)',
        onChange: (v) => handleChange('facing', v),
      },
    }),
    [entity.id]
  )

  // Mark as initialized after first render
  useEffect(() => {
    const timer = setTimeout(() => {
      isInitialized.current = true
    }, 50)
    return () => {
      clearTimeout(timer)
      isInitialized.current = false
    }
  }, [entity.id])

  return null
}
