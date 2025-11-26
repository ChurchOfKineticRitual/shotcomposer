# ShotComposer Technical Specification

This document provides detailed implementation specifications for Claude Code to build the ShotComposer application.

## MVP Features (v1)

1. Add basic entities (boxes for characters/objects with labels)
2. Add posable human figures using Mannequin.js
3. Position director camera with orbit + position controls
4. See 16:9 frame preview in real-time
5. Export render as PNG
6. Copy auto-generated prompt describing the shot
7. Save/load pose presets

## Implementation Details

### 1. Project Setup

```bash
npm create vite@latest shotcomposer -- --template react
cd shotcomposer
npm install @react-three/fiber @react-three/drei three leva camera-controls
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Dual Viewport Implementation

Use R3F's `View` component from Drei for split viewports:

```jsx
// SceneCanvas.jsx
import { Canvas } from '@react-three/fiber';
import { View, Preload } from '@react-three/drei';

export function SceneCanvas() {
  const containerRef = useRef();
  
  return (
    <div ref={containerRef} className="w-full h-screen flex">
      {/* Left: Scene overview */}
      <div className="w-1/2 h-full">
        <View className="w-full h-full">
          <SceneOverview />
        </View>
      </div>
      
      {/* Right: Director's frame (16:9) */}
      <div className="w-1/2 h-full flex items-center justify-center bg-gray-900">
        <div className="aspect-video w-full max-w-[calc(100vh*16/9)] border-2 border-yellow-500">
          <View className="w-full h-full">
            <DirectorFrame />
          </View>
        </div>
      </div>
      
      {/* Shared Canvas */}
      <Canvas
        eventSource={containerRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <View.Port />
        <Preload all />
      </Canvas>
    </div>
  );
}
```

### 3. Director Camera with Frustum Visualization

```jsx
// DirectorCamera.jsx
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, CameraHelper } from 'three';

export function DirectorCamera({ position, rotation, fov, showHelper = true }) {
  const cameraRef = useRef();
  const helperRef = useRef();
  
  useEffect(() => {
    if (cameraRef.current && helperRef.current) {
      helperRef.current.update();
    }
  });
  
  return (
    <>
      <perspectiveCamera
        ref={cameraRef}
        position={position}
        rotation={rotation}
        fov={fov}
        aspect={16/9}
        near={0.1}
        far={1000}
      />
      {showHelper && cameraRef.current && (
        <primitive object={new CameraHelper(cameraRef.current)} ref={helperRef} />
      )}
    </>
  );
}
```

### 4. Camera Controls (Scene Overview)

Use camera-controls for cinematographic control:

```jsx
// SceneOverview.jsx
import CameraControls from 'camera-controls';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';

CameraControls.install({ THREE });

export function CameraControlsWrapper() {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  
  useEffect(() => {
    controlsRef.current = new CameraControls(camera, gl.domElement);
    return () => controlsRef.current.dispose();
  }, [camera, gl]);
  
  useFrame((_, delta) => {
    controlsRef.current?.update(delta);
  });
  
  return null;
}
```

### 5. Mannequin.js Integration

Mannequin.js creates its own Three.js objects. Wrap it for R3F:

```jsx
// entities/HumanFigure.jsx
import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
// Note: Mannequin.js needs to be loaded globally or bundled

export function HumanFigure({ 
  pose = {}, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  label = 'PERSON',
  onClick,
  selected = false 
}) {
  const groupRef = useRef();
  const mannequinRef = useRef();
  
  useEffect(() => {
    // Create mannequin (assumes Mannequin.js is loaded)
    if (typeof Male !== 'undefined') {
      const man = new Male();
      mannequinRef.current = man;
      
      // Extract the Three.js object and add to group
      // Mannequin.js figures have a .body property that's the root Object3D
      groupRef.current.add(man);
    }
    
    return () => {
      if (mannequinRef.current && groupRef.current) {
        groupRef.current.remove(mannequinRef.current);
      }
    };
  }, []);
  
  // Apply pose changes
  useEffect(() => {
    if (!mannequinRef.current) return;
    applyPose(mannequinRef.current, pose);
  }, [pose]);
  
  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation}
      onClick={onClick}
    >
      {/* Label overlay */}
      <Html position={[0, 2, 0]} center>
        <div className={`px-2 py-1 text-xs font-mono ${selected ? 'bg-yellow-500' : 'bg-gray-800'} text-white rounded`}>
          {label}
        </div>
      </Html>
    </group>
  );
}

function applyPose(mannequin, pose) {
  // Body
  if (pose.body) {
    if (pose.body.tilt !== undefined) mannequin.body.tilt = pose.body.tilt;
    if (pose.body.bend !== undefined) mannequin.body.bend = pose.body.bend;
    if (pose.body.turn !== undefined) mannequin.body.turn = pose.body.turn;
  }
  
  // Head
  if (pose.head) {
    if (pose.head.nod !== undefined) mannequin.head.nod = pose.head.nod;
    if (pose.head.turn !== undefined) mannequin.head.turn = pose.head.turn;
    if (pose.head.tilt !== undefined) mannequin.head.tilt = pose.head.tilt;
  }
  
  // Left arm
  if (pose.l_arm) {
    if (pose.l_arm.raise !== undefined) mannequin.l_arm.raise = pose.l_arm.raise;
    if (pose.l_arm.straddle !== undefined) mannequin.l_arm.straddle = pose.l_arm.straddle;
    if (pose.l_arm.turn !== undefined) mannequin.l_arm.turn = pose.l_arm.turn;
  }
  if (pose.l_elbow) {
    if (pose.l_elbow.bend !== undefined) mannequin.l_elbow.bend = pose.l_elbow.bend;
  }
  if (pose.l_wrist) {
    if (pose.l_wrist.bend !== undefined) mannequin.l_wrist.bend = pose.l_wrist.bend;
    if (pose.l_wrist.turn !== undefined) mannequin.l_wrist.turn = pose.l_wrist.turn;
    if (pose.l_wrist.tilt !== undefined) mannequin.l_wrist.tilt = pose.l_wrist.tilt;
  }
  
  // Right arm (mirror of left)
  if (pose.r_arm) {
    if (pose.r_arm.raise !== undefined) mannequin.r_arm.raise = pose.r_arm.raise;
    if (pose.r_arm.straddle !== undefined) mannequin.r_arm.straddle = pose.r_arm.straddle;
    if (pose.r_arm.turn !== undefined) mannequin.r_arm.turn = pose.r_arm.turn;
  }
  if (pose.r_elbow) {
    if (pose.r_elbow.bend !== undefined) mannequin.r_elbow.bend = pose.r_elbow.bend;
  }
  if (pose.r_wrist) {
    if (pose.r_wrist.bend !== undefined) mannequin.r_wrist.bend = pose.r_wrist.bend;
    if (pose.r_wrist.turn !== undefined) mannequin.r_wrist.turn = pose.r_wrist.turn;
    if (pose.r_wrist.tilt !== undefined) mannequin.r_wrist.tilt = pose.r_wrist.tilt;
  }
  
  // Legs (similar pattern)
  if (pose.l_leg) {
    if (pose.l_leg.raise !== undefined) mannequin.l_leg.raise = pose.l_leg.raise;
    if (pose.l_leg.straddle !== undefined) mannequin.l_leg.straddle = pose.l_leg.straddle;
    if (pose.l_leg.turn !== undefined) mannequin.l_leg.turn = pose.l_leg.turn;
  }
  if (pose.l_knee) {
    if (pose.l_knee.bend !== undefined) mannequin.l_knee.bend = pose.l_knee.bend;
  }
  if (pose.l_ankle) {
    if (pose.l_ankle.bend !== undefined) mannequin.l_ankle.bend = pose.l_ankle.bend;
    if (pose.l_ankle.turn !== undefined) mannequin.l_ankle.turn = pose.l_ankle.turn;
  }
  
  // Right leg
  if (pose.r_leg) {
    if (pose.r_leg.raise !== undefined) mannequin.r_leg.raise = pose.r_leg.raise;
    if (pose.r_leg.straddle !== undefined) mannequin.r_leg.straddle = pose.r_leg.straddle;
    if (pose.r_leg.turn !== undefined) mannequin.r_leg.turn = pose.r_leg.turn;
  }
  if (pose.r_knee) {
    if (pose.r_knee.bend !== undefined) mannequin.r_knee.bend = pose.r_knee.bend;
  }
  if (pose.r_ankle) {
    if (pose.r_ankle.bend !== undefined) mannequin.r_ankle.bend = pose.r_ankle.bend;
    if (pose.r_ankle.turn !== undefined) mannequin.r_ankle.turn = pose.r_ankle.turn;
  }
  
  // Torso
  if (pose.torso) {
    if (pose.torso.bend !== undefined) mannequin.torso.bend = pose.torso.bend;
    if (pose.torso.turn !== undefined) mannequin.torso.turn = pose.torso.turn;
    if (pose.torso.tilt !== undefined) mannequin.torso.tilt = pose.torso.tilt;
  }
}
```

### 6. Pose Controls UI

```jsx
// entities/PoseControls.jsx
import { useControls, folder } from 'leva';

export function usePoseControls(initialPose = {}) {
  const pose = useControls('Pose', {
    body: folder({
      'body.tilt': { value: initialPose.body?.tilt ?? 0, min: -45, max: 45 },
      'body.bend': { value: initialPose.body?.bend ?? 0, min: -45, max: 45 },
      'body.turn': { value: initialPose.body?.turn ?? 0, min: -180, max: 180 },
    }),
    head: folder({
      'head.nod': { value: initialPose.head?.nod ?? 0, min: -45, max: 45 },
      'head.turn': { value: initialPose.head?.turn ?? 0, min: -90, max: 90 },
      'head.tilt': { value: initialPose.head?.tilt ?? 0, min: -30, max: 30 },
    }),
    leftArm: folder({
      'l_arm.raise': { value: initialPose.l_arm?.raise ?? 0, min: -180, max: 180 },
      'l_arm.straddle': { value: initialPose.l_arm?.straddle ?? 0, min: -90, max: 180 },
      'l_elbow.bend': { value: initialPose.l_elbow?.bend ?? 0, min: 0, max: 160 },
    }),
    rightArm: folder({
      'r_arm.raise': { value: initialPose.r_arm?.raise ?? 0, min: -180, max: 180 },
      'r_arm.straddle': { value: initialPose.r_arm?.straddle ?? 0, min: -90, max: 180 },
      'r_elbow.bend': { value: initialPose.r_elbow?.bend ?? 0, min: 0, max: 160 },
    }),
    // ... similar for legs
  });
  
  // Convert flat Leva output to nested pose object
  return convertToPose(pose);
}

function convertToPose(flatPose) {
  const pose = {};
  for (const [key, value] of Object.entries(flatPose)) {
    const [part, prop] = key.split('.');
    if (!pose[part]) pose[part] = {};
    pose[part][prop] = value;
  }
  return pose;
}
```

### 7. Generic Volume for Non-Humans

```jsx
// entities/GenericVolume.jsx
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const VOLUME_SHAPES = {
  quadruped: { geometry: 'capsule', args: [0.3, 1, 8, 16] },
  bird: { geometry: 'sphere', args: [0.4, 16, 16] },
  serpent: { geometry: 'cylinder', args: [0.2, 0.1, 1.5, 8] },
  humanoid: { geometry: 'capsule', args: [0.25, 0.8, 8, 16] },
  blob: { geometry: 'sphere', args: [0.5, 16, 16] },
};

export function GenericVolume({ 
  type = 'blob',
  label = 'CREATURE',
  facing = 0,
  position = [0, 0, 0],
  scale = 1,
  onClick,
  selected = false
}) {
  const shape = VOLUME_SHAPES[type] || VOLUME_SHAPES.blob;
  
  const GeometryComponent = {
    capsule: 'capsuleGeometry',
    sphere: 'sphereGeometry',
    cylinder: 'cylinderGeometry',
    box: 'boxGeometry',
  }[shape.geometry];
  
  return (
    <group 
      position={position} 
      rotation={[0, THREE.MathUtils.degToRad(facing), 0]}
      onClick={onClick}
    >
      {/* Body volume */}
      <mesh scale={scale}>
        <GeometryComponent args={shape.args} />
        <meshStandardMaterial 
          color={selected ? '#fbbf24' : '#888888'} 
          transparent 
          opacity={0.7} 
        />
      </mesh>
      
      {/* Facing indicator cone */}
      <mesh position={[0, 0, 0.6 * scale]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1 * scale, 0.3 * scale, 8]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
      
      {/* Label */}
      <Html position={[0, 0.8 * scale, 0]} center>
        <div className={`px-2 py-1 text-xs font-mono uppercase ${selected ? 'bg-yellow-500' : 'bg-gray-800'} text-white rounded whitespace-nowrap`}>
          {label}
        </div>
      </Html>
    </group>
  );
}
```

### 8. PNG Export

```jsx
// export/RenderExport.jsx
import { useThree } from '@react-three/fiber';
import { useCallback } from 'react';

export function useRenderExport(directorCameraRef) {
  const { gl, scene } = useThree();
  
  const exportPNG = useCallback((width = 1920, height = 1080) => {
    if (!directorCameraRef.current) return;
    
    // Store original size
    const originalSize = gl.getSize(new THREE.Vector2());
    
    // Resize for export
    gl.setSize(width, height);
    
    // Render from director camera
    gl.render(scene, directorCameraRef.current);
    
    // Capture
    const dataURL = gl.domElement.toDataURL('image/png');
    
    // Restore original size
    gl.setSize(originalSize.x, originalSize.y);
    
    // Download
    const link = document.createElement('a');
    link.download = `shot-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    return dataURL;
  }, [gl, scene, directorCameraRef]);
  
  return { exportPNG };
}
```

### 9. Auto-Prompt Generation

```javascript
// utils/cinematography.js

export function classifyShot(fov) {
  if (fov < 25) return 'extreme close-up';
  if (fov < 35) return 'close-up';
  if (fov < 50) return 'medium close-up';
  if (fov < 65) return 'medium shot';
  if (fov < 80) return 'medium wide shot';
  if (fov < 100) return 'wide shot';
  return 'extreme wide shot';
}

export function classifyAngle(cameraY, targetY = 0) {
  const diff = cameraY - targetY;
  if (diff > 2) return "bird's eye view";
  if (diff > 0.5) return 'high angle';
  if (diff < -2) return "worm's eye view";
  if (diff < -0.5) return 'low angle';
  return 'eye level';
}

export function describeDepth(entityZ, cameraZ) {
  const distance = Math.abs(entityZ - cameraZ);
  if (distance < 3) return 'foreground';
  if (distance < 8) return 'midground';
  return 'background';
}

export function describeFacing(entityRotationY, cameraPosition, entityPosition) {
  // Calculate angle between entity facing and camera direction
  const toCameraAngle = Math.atan2(
    cameraPosition[0] - entityPosition[0],
    cameraPosition[2] - entityPosition[2]
  );
  const entityFacing = entityRotationY;
  const angleDiff = Math.abs(toCameraAngle - entityFacing);
  
  if (angleDiff < Math.PI / 6) return 'facing camera';
  if (angleDiff > Math.PI * 5/6) return 'facing away';
  if (angleDiff < Math.PI / 2) return 'three-quarter view';
  return 'profile view';
}

export function generatePrompt(camera, entities) {
  const shotType = classifyShot(camera.fov);
  const angle = classifyAngle(camera.position[1]);
  
  const entityDescriptions = entities.map(entity => {
    const depth = describeDepth(entity.position[2], camera.position[2]);
    const facing = describeFacing(entity.rotation[1], camera.position, entity.position);
    
    if (entity.type === 'human') {
      const poseDesc = describePose(entity.pose);
      return `In the ${depth}, a ${entity.label || 'person'} ${poseDesc}, ${facing}`;
    } else {
      return `In the ${depth}, a ${entity.label} ${facing}`;
    }
  });
  
  return {
    camera: `${shotType}, ${angle}`,
    entities: entityDescriptions,
    full: `${shotType} from a ${angle}. ${entityDescriptions.join('. ')}.`
  };
}

function describePose(pose) {
  const descriptions = [];
  
  // Check arms
  if (pose.l_arm?.raise > 60 || pose.r_arm?.raise > 60) {
    descriptions.push('with arm raised');
  }
  if (pose.l_elbow?.bend > 90 || pose.r_elbow?.bend > 90) {
    descriptions.push('arm bent');
  }
  
  // Check legs
  if (pose.l_leg?.raise > 30 || pose.r_leg?.raise > 30) {
    descriptions.push('leg lifted');
  }
  if (pose.l_knee?.bend > 60 || pose.r_knee?.bend > 60) {
    descriptions.push('knee bent');
  }
  
  // Check body
  if (Math.abs(pose.body?.bend || 0) > 20) {
    descriptions.push(pose.body.bend > 0 ? 'leaning forward' : 'leaning back');
  }
  
  // Check head
  if (Math.abs(pose.head?.turn || 0) > 30) {
    descriptions.push('head turned');
  }
  
  return descriptions.length > 0 ? descriptions.join(', ') : 'standing';
}
```

### 10. State Management

For MVP, use React context + useReducer:

```jsx
// context/SceneContext.jsx
import { createContext, useContext, useReducer } from 'react';

const initialState = {
  entities: [],
  selectedEntityId: null,
  directorCamera: {
    position: [0, 1.6, 5],
    rotation: [0, 0, 0],
    fov: 50,
  },
};

function sceneReducer(state, action) {
  switch (action.type) {
    case 'ADD_ENTITY':
      return {
        ...state,
        entities: [...state.entities, { id: Date.now(), ...action.payload }],
      };
    case 'UPDATE_ENTITY':
      return {
        ...state,
        entities: state.entities.map(e =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      };
    case 'REMOVE_ENTITY':
      return {
        ...state,
        entities: state.entities.filter(e => e.id !== action.payload),
        selectedEntityId: state.selectedEntityId === action.payload ? null : state.selectedEntityId,
      };
    case 'SELECT_ENTITY':
      return { ...state, selectedEntityId: action.payload };
    case 'UPDATE_CAMERA':
      return {
        ...state,
        directorCamera: { ...state.directorCamera, ...action.payload },
      };
    default:
      return state;
  }
}

const SceneContext = createContext();

export function SceneProvider({ children }) {
  const [state, dispatch] = useReducer(sceneReducer, initialState);
  return (
    <SceneContext.Provider value={{ state, dispatch }}>
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  return useContext(SceneContext);
}
```

---

## v2 Features (Future)

1. Depth map export with custom shader
2. Multiple director cameras for shot sequences
3. Import custom 3D assets (GLB/GLTF)
4. Direct NanoBanana API integration
5. Wireframe/silhouette render modes
6. Pose from reference image (upload image → detect pose → apply)
7. Timeline for camera animations
8. Creature template library with silhouettes
