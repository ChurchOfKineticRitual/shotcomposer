# Mannequin.js Integration Guide

This document provides detailed information about integrating Mannequin.js with React Three Fiber.

## About Mannequin.js

- **Source:** https://boytchev.github.io/mannequin.js/
- **GitHub:** https://github.com/boytchev/mannequin.js/
- **License:** GPL-3.0
- **Dependencies:** Three.js (included in R3F stack)

Mannequin.js is a library for articulated human figures. The shape and movements are done purely in JavaScript on top of Three.js.

## Loading Mannequin.js

### NPM Package (Recommended)

The library is available as an npm package:

```bash
npm install mannequin-js
```

Import the classes directly in your components:

```javascript
import { Male } from 'mannequin-js/src/bodies/Male.js';
import { Female } from 'mannequin-js/src/bodies/Female.js';
import { Child } from 'mannequin-js/src/bodies/Child.js';
import { Mannequin } from 'mannequin-js/src/bodies/Mannequin.js';
```

## Figure Types

```javascript
// Default neutral posture
const figure = new Mannequin();

// Gender-specific default postures
const man = new Male();
const woman = new Female();

// Child proportions
const child = new Child();
```

## Body Part Hierarchy

### Central Parts (Single Instance)

| Part | Properties | Description |
|------|------------|-------------|
| `body` | tilt, bend, turn | Whole body position |
| `pelvis` | tilt, bend, turn | Hip area |
| `torso` | tilt, bend, turn | Chest/ribcage |
| `neck` | tilt, bend, turn | Neck |
| `head` | nod, turn, tilt | Head (nod = nodding yes) |

### Paired Parts (Left/Right)

| Part | Properties | Notes |
|------|------------|-------|
| `l_arm` / `r_arm` | raise, straddle, turn | Upper arm at shoulder |
| `l_elbow` / `r_elbow` | bend | Forearm at elbow |
| `l_wrist` / `r_wrist` | bend, turn, tilt | Hand at wrist |
| `l_fingers` / `r_fingers` | bend | All fingers together |
| `l_leg` / `r_leg` | raise, straddle, turn | Thigh at hip |
| `l_knee` / `r_knee` | bend | Lower leg at knee |
| `l_ankle` / `r_ankle` | bend, turn | Foot at ankle |

## Rotation Properties

All rotation values are in **degrees**. 180 = half turn, 360 = full turn.

### Property Meanings

| Property | Axis | Example Motion |
|----------|------|----------------|
| `bend` | X | Nodding head, bending elbow |
| `turn` | Y | Shaking head "no", rotating wrist |
| `tilt` | Z | Tilting head to shoulder |
| `raise` | X | Lifting arm forward/up |
| `straddle` | Z | Moving arm/leg sideways |
| `nod` | X | Head-specific nodding |

### Setting Rotations

**Absolute (set to specific value):**
```javascript
man.torso.bend = 45;  // Bend torso forward 45°
```

**Relative (modify current value):**
```javascript
man.torso.bend += 15;  // Add 15° to current bend
```

## Complete Pose Example

```javascript
// Tai Chi-inspired pose
const man = new Male();

// Overall body
man.body.tilt = -5;
man.body.bend = 15.2;

// Torso and head
man.torso.turn = -30;
man.head.turn = -70;

// Right leg
man.r_leg.turn = 50;
man.r_knee.bend = 90;
man.r_ankle.bend = 15;

// Left leg
man.l_leg.raise = -20;
man.l_knee.bend = 30;
man.l_ankle.bend = 42;

// Left arm
man.l_arm.straddle = 70;
man.l_elbow.bend = 155;
man.l_wrist.bend = -20;

// Right arm
man.r_arm.straddle = 70;
man.r_elbow.bend = 40;
man.r_wrist.turn = -60;
```

## Positioning the Figure

The figure is a Three.js Object3D, so standard positioning works:

```javascript
const man = new Male();

// Position
man.position.set(x, y, z);
man.position.x = 5;

// Rotation (whole figure)
man.turn = 90;  // Turn figure 90° (convenience method)
// or
man.rotation.y = Math.PI / 2;

// Scale
man.scale.set(1.2, 1.2, 1.2);
```

## Biological Constraints

By default, Mannequin.js has biological constraints preventing impossible poses. These can be disabled if needed:

```javascript
// In the mannequin.js source, constraints are defined per joint
// For our use case, the defaults are fine
```

## R3F Integration Pattern

### Basic Wrapper Component

```jsx
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export function MannequinFigure({ pose, position, rotation }) {
  const groupRef = useRef();
  const mannequinRef = useRef();
  
  useEffect(() => {
    // Create mannequin on mount
    const man = new Male();
    mannequinRef.current = man;
    groupRef.current.add(man);
    
    return () => {
      groupRef.current.remove(man);
    };
  }, []);
  
  // Apply pose reactively
  useEffect(() => {
    if (!mannequinRef.current || !pose) return;
    
    const m = mannequinRef.current;
    
    // Apply each body part's pose
    Object.entries(pose).forEach(([part, props]) => {
      if (m[part]) {
        Object.entries(props).forEach(([prop, value]) => {
          if (m[part][prop] !== undefined) {
            m[part][prop] = value;
          }
        });
      }
    });
  }, [pose]);
  
  return (
    <group ref={groupRef} position={position} rotation={rotation} />
  );
}
```

### With Selection and Interaction

```jsx
import { Html } from '@react-three/drei';

export function SelectableMannequin({ 
  id,
  pose, 
  position, 
  label,
  selected,
  onSelect 
}) {
  const groupRef = useRef();
  const mannequinRef = useRef();
  
  // ... setup effect same as above ...
  
  return (
    <group 
      ref={groupRef} 
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {/* Selection indicator */}
      {selected && (
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0.8, 0.85, 32]} />
          <meshBasicMaterial color="#facc15" side={THREE.DoubleSide} />
        </mesh>
      )}
      
      {/* Label */}
      <Html position={[0, 2, 0]} center>
        <div className={`px-2 py-1 text-xs ${selected ? 'bg-yellow-500' : 'bg-gray-700'} text-white rounded`}>
          {label}
        </div>
      </Html>
    </group>
  );
}
```

## Pose Preset Format

Store poses as JSON for easy save/load:

```json
{
  "standing_neutral": {
    "body": { "tilt": 0, "bend": 0, "turn": 0 },
    "head": { "nod": 0, "turn": 0, "tilt": 0 },
    "torso": { "bend": 0, "turn": 0, "tilt": 0 },
    "l_arm": { "raise": -10, "straddle": 8, "turn": 0 },
    "l_elbow": { "bend": 5 },
    "l_wrist": { "bend": 0, "turn": 0, "tilt": 0 },
    "r_arm": { "raise": -10, "straddle": 8, "turn": 0 },
    "r_elbow": { "bend": 5 },
    "r_wrist": { "bend": 0, "turn": 0, "tilt": 0 },
    "l_leg": { "raise": 0, "straddle": 0, "turn": 0 },
    "l_knee": { "bend": 0 },
    "l_ankle": { "bend": 0, "turn": 0 },
    "r_leg": { "raise": 0, "straddle": 0, "turn": 0 },
    "r_knee": { "bend": 0 },
    "r_ankle": { "bend": 0, "turn": 0 }
  },
  "walking": {
    "body": { "bend": 5 },
    "l_arm": { "raise": 30, "straddle": 5 },
    "r_arm": { "raise": -20, "straddle": 5 },
    "l_leg": { "raise": -15 },
    "r_leg": { "raise": 25 },
    "r_knee": { "bend": 40 }
  },
  "sitting": {
    "l_leg": { "raise": 90 },
    "l_knee": { "bend": 90 },
    "r_leg": { "raise": 90 },
    "r_knee": { "bend": 90 },
    "l_arm": { "raise": -30, "straddle": 30 },
    "r_arm": { "raise": -30, "straddle": 30 }
  },
  "pointing": {
    "r_arm": { "raise": 60, "straddle": 10 },
    "r_elbow": { "bend": 10 },
    "head": { "turn": 15 }
  },
  "arms_raised": {
    "l_arm": { "raise": 170, "straddle": 20 },
    "l_elbow": { "bend": 10 },
    "r_arm": { "raise": 170, "straddle": 20 },
    "r_elbow": { "bend": 10 }
  }
}
```

## Extracting Current Pose

To save the current pose from a mannequin:

```javascript
function extractPose(mannequin) {
  const pose = {};
  
  const parts = [
    'body', 'head', 'torso', 'pelvis', 'neck',
    'l_arm', 'l_elbow', 'l_wrist', 'l_fingers',
    'r_arm', 'r_elbow', 'r_wrist', 'r_fingers',
    'l_leg', 'l_knee', 'l_ankle',
    'r_leg', 'r_knee', 'r_ankle'
  ];
  
  const props = ['bend', 'turn', 'tilt', 'raise', 'straddle', 'nod'];
  
  parts.forEach(part => {
    if (mannequin[part]) {
      pose[part] = {};
      props.forEach(prop => {
        if (mannequin[part][prop] !== undefined) {
          pose[part][prop] = mannequin[part][prop];
        }
      });
    }
  });
  
  return pose;
}
```

## Tips

1. **Animation**: Mannequin.js supports an `animate(t)` function for dynamic poses. For our static previz use case, we don't need this.

2. **Attaching objects**: You can attach objects to body parts using `bodyPart.attach(object)`. Useful for props.

3. **Forward kinematics**: Each body part has a `point(x,y,z)` method that calculates global coordinates of a local point. Useful for determining where hands/feet are in world space.

4. **Material customization**: The mannequin's materials can be modified via standard Three.js material properties.

5. **Performance**: Creating many mannequins is relatively lightweight. For our use case (1-5 figures per scene), performance is not a concern.
