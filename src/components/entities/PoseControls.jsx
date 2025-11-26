// PoseControls.jsx - Bend/Tilt/Rotate UI for body parts
import { useControls, folder } from 'leva'
import { useEffect, useRef, useCallback } from 'react'

/**
 * PoseControls - Leva-based UI for editing human figure poses
 *
 * @param {Object} entity - The selected human entity from SceneContext
 * @param {Function} onPoseChange - Callback when pose values change
 */
export default function PoseControls({ entity, onPoseChange }) {
  if (!entity || entity.type !== 'human') {
    return null
  }

  return <PoseControlsInner entity={entity} onPoseChange={onPoseChange} />
}

function PoseControlsInner({ entity, onPoseChange }) {
  // Track initialization to prevent loop on first render
  const isInitialized = useRef(false)
  const currentPoseRef = useRef(entity.pose || {})

  // Update ref when entity changes
  useEffect(() => {
    currentPoseRef.current = entity.pose || {}
  }, [entity.pose])

  // Handler that updates pose state - memoized to prevent recreation
  const handlePoseChange = useCallback((key, value) => {
    if (!isInitialized.current) return

    // Parse key like 'body.tilt' into part and prop
    const [part, prop] = key.split('.')
    if (!part || !prop) return

    // Check if value actually changed
    const currentValue = currentPoseRef.current[part]?.[prop]
    if (currentValue === value) return

    // Build new pose object
    const newPose = {
      ...currentPoseRef.current,
      [part]: {
        ...(currentPoseRef.current[part] || {}),
        [prop]: value
      }
    }

    // Update ref and call handler
    currentPoseRef.current = newPose
    onPoseChange(entity.id, newPose)
  }, [entity.id, onPoseChange])

  const initialPose = entity.pose || {}

  // Define Leva controls with onChange handlers
  useControls(
    'Pose Editor',
    {
      body: folder({
        'body.tilt': {
          value: initialPose.body?.tilt ?? 0,
          min: -45, max: 45, step: 1,
          label: 'Tilt (side bend)',
          onChange: (v) => handlePoseChange('body.tilt', v)
        },
        'body.bend': {
          value: initialPose.body?.bend ?? 0,
          min: -45, max: 45, step: 1,
          label: 'Bend (forward/back)',
          onChange: (v) => handlePoseChange('body.bend', v)
        },
        'body.turn': {
          value: initialPose.body?.turn ?? 0,
          min: -180, max: 180, step: 1,
          label: 'Turn (rotate)',
          onChange: (v) => handlePoseChange('body.turn', v)
        },
      }),

      head: folder({
        'head.nod': {
          value: initialPose.head?.nod ?? 0,
          min: -45, max: 45, step: 1,
          label: 'Nod (up/down)',
          onChange: (v) => handlePoseChange('head.nod', v)
        },
        'head.turn': {
          value: initialPose.head?.turn ?? 0,
          min: -90, max: 90, step: 1,
          label: 'Turn (left/right)',
          onChange: (v) => handlePoseChange('head.turn', v)
        },
        'head.tilt': {
          value: initialPose.head?.tilt ?? 0,
          min: -30, max: 30, step: 1,
          label: 'Tilt (to shoulder)',
          onChange: (v) => handlePoseChange('head.tilt', v)
        },
      }),

      torso: folder({
        'torso.bend': {
          value: initialPose.torso?.bend ?? 0,
          min: -45, max: 45, step: 1,
          label: 'Bend',
          onChange: (v) => handlePoseChange('torso.bend', v)
        },
        'torso.turn': {
          value: initialPose.torso?.turn ?? 0,
          min: -90, max: 90, step: 1,
          label: 'Turn',
          onChange: (v) => handlePoseChange('torso.turn', v)
        },
        'torso.tilt': {
          value: initialPose.torso?.tilt ?? 0,
          min: -45, max: 45, step: 1,
          label: 'Tilt',
          onChange: (v) => handlePoseChange('torso.tilt', v)
        },
      }),

      leftArm: folder({
        'l_arm.raise': {
          value: initialPose.l_arm?.raise ?? -10,
          min: -180, max: 180, step: 1,
          label: 'Raise (up/down)',
          onChange: (v) => handlePoseChange('l_arm.raise', v)
        },
        'l_arm.straddle': {
          value: initialPose.l_arm?.straddle ?? 8,
          min: -90, max: 180, step: 1,
          label: 'Straddle (out/in)',
          onChange: (v) => handlePoseChange('l_arm.straddle', v)
        },
        'l_arm.turn': {
          value: initialPose.l_arm?.turn ?? 0,
          min: -180, max: 180, step: 1,
          label: 'Turn (rotate)',
          onChange: (v) => handlePoseChange('l_arm.turn', v)
        },
        'l_elbow.bend': {
          value: initialPose.l_elbow?.bend ?? 5,
          min: 0, max: 160, step: 1,
          label: 'Elbow Bend',
          onChange: (v) => handlePoseChange('l_elbow.bend', v)
        },
        'l_wrist.bend': {
          value: initialPose.l_wrist?.bend ?? 0,
          min: -90, max: 90, step: 1,
          label: 'Wrist Bend',
          onChange: (v) => handlePoseChange('l_wrist.bend', v)
        },
        'l_wrist.turn': {
          value: initialPose.l_wrist?.turn ?? 0,
          min: -180, max: 180, step: 1,
          label: 'Wrist Turn',
          onChange: (v) => handlePoseChange('l_wrist.turn', v)
        },
      }),

      rightArm: folder({
        'r_arm.raise': {
          value: initialPose.r_arm?.raise ?? -10,
          min: -180, max: 180, step: 1,
          label: 'Raise (up/down)',
          onChange: (v) => handlePoseChange('r_arm.raise', v)
        },
        'r_arm.straddle': {
          value: initialPose.r_arm?.straddle ?? 8,
          min: -90, max: 180, step: 1,
          label: 'Straddle (out/in)',
          onChange: (v) => handlePoseChange('r_arm.straddle', v)
        },
        'r_arm.turn': {
          value: initialPose.r_arm?.turn ?? 0,
          min: -180, max: 180, step: 1,
          label: 'Turn (rotate)',
          onChange: (v) => handlePoseChange('r_arm.turn', v)
        },
        'r_elbow.bend': {
          value: initialPose.r_elbow?.bend ?? 5,
          min: 0, max: 160, step: 1,
          label: 'Elbow Bend',
          onChange: (v) => handlePoseChange('r_elbow.bend', v)
        },
        'r_wrist.bend': {
          value: initialPose.r_wrist?.bend ?? 0,
          min: -90, max: 90, step: 1,
          label: 'Wrist Bend',
          onChange: (v) => handlePoseChange('r_wrist.bend', v)
        },
        'r_wrist.turn': {
          value: initialPose.r_wrist?.turn ?? 0,
          min: -180, max: 180, step: 1,
          label: 'Wrist Turn',
          onChange: (v) => handlePoseChange('r_wrist.turn', v)
        },
      }),

      leftLeg: folder({
        'l_leg.raise': {
          value: initialPose.l_leg?.raise ?? 0,
          min: -90, max: 90, step: 1,
          label: 'Raise (forward/back)',
          onChange: (v) => handlePoseChange('l_leg.raise', v)
        },
        'l_leg.straddle': {
          value: initialPose.l_leg?.straddle ?? 0,
          min: -90, max: 90, step: 1,
          label: 'Straddle (out/in)',
          onChange: (v) => handlePoseChange('l_leg.straddle', v)
        },
        'l_leg.turn': {
          value: initialPose.l_leg?.turn ?? 0,
          min: -90, max: 90, step: 1,
          label: 'Turn (rotate)',
          onChange: (v) => handlePoseChange('l_leg.turn', v)
        },
        'l_knee.bend': {
          value: initialPose.l_knee?.bend ?? 0,
          min: 0, max: 160, step: 1,
          label: 'Knee Bend',
          onChange: (v) => handlePoseChange('l_knee.bend', v)
        },
        'l_ankle.bend': {
          value: initialPose.l_ankle?.bend ?? 0,
          min: -45, max: 45, step: 1,
          label: 'Ankle Bend',
          onChange: (v) => handlePoseChange('l_ankle.bend', v)
        },
        'l_ankle.turn': {
          value: initialPose.l_ankle?.turn ?? 0,
          min: -45, max: 45, step: 1,
          label: 'Ankle Turn',
          onChange: (v) => handlePoseChange('l_ankle.turn', v)
        },
      }),

      rightLeg: folder({
        'r_leg.raise': {
          value: initialPose.r_leg?.raise ?? 0,
          min: -90, max: 90, step: 1,
          label: 'Raise (forward/back)',
          onChange: (v) => handlePoseChange('r_leg.raise', v)
        },
        'r_leg.straddle': {
          value: initialPose.r_leg?.straddle ?? 0,
          min: -90, max: 90, step: 1,
          label: 'Straddle (out/in)',
          onChange: (v) => handlePoseChange('r_leg.straddle', v)
        },
        'r_leg.turn': {
          value: initialPose.r_leg?.turn ?? 0,
          min: -90, max: 90, step: 1,
          label: 'Turn (rotate)',
          onChange: (v) => handlePoseChange('r_leg.turn', v)
        },
        'r_knee.bend': {
          value: initialPose.r_knee?.bend ?? 0,
          min: 0, max: 160, step: 1,
          label: 'Knee Bend',
          onChange: (v) => handlePoseChange('r_knee.bend', v)
        },
        'r_ankle.bend': {
          value: initialPose.r_ankle?.bend ?? 0,
          min: -45, max: 45, step: 1,
          label: 'Ankle Bend',
          onChange: (v) => handlePoseChange('r_ankle.bend', v)
        },
        'r_ankle.turn': {
          value: initialPose.r_ankle?.turn ?? 0,
          min: -45, max: 45, step: 1,
          label: 'Ankle Turn',
          onChange: (v) => handlePoseChange('r_ankle.turn', v)
        },
      }),
    },
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
