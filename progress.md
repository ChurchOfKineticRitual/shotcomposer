# ShotComposer - Development Progress

## Current Status (2025-11-26)

**Phase 1-2 Complete** - Core viewport system and camera controls working.

The app renders two synchronized viewports:
- **Scene Overview**: Orbit camera with visible director camera frustum
- **Director's Frame**: 16:9 frame showing director camera POV with keyboard controls

## Completed Features

### Phase 1: Dual Viewport System
- ✅ Split viewport layout using Drei's `View` component
- ✅ Scene Overview with orbit controls (OrbitControls from Drei)
- ✅ Director's Frame with fixed 16:9 aspect ratio
- ✅ Shared scene content (grid, lighting, test cube) rendered in both views

### Phase 2: Camera & Controls
- ✅ SceneContext state management (useReducer pattern)
- ✅ Director camera with position, rotation, FOV state
- ✅ Camera frustum visualization in Scene Overview (THREE.CameraHelper)
- ✅ Camera UI sliders in sidebar (position X/Y/Z, rotation X/Y, FOV)
- ✅ Keyboard controls (WASD/Q/E/R/F/Z/X) when Director's Frame is focused
- ✅ Focus management with visual feedback (yellow border when active)
- ✅ Real-time sync between keyboard movement, sliders, and frustum

### Key Files Implemented
```
src/
├── context/SceneContext.jsx    # State management (entities, camera)
├── components/
│   ├── SceneCanvas.jsx         # Dual viewport with focus management
│   ├── DirectorCamera.jsx      # Camera view + frustum components
│   └── CameraUI.jsx            # Sidebar camera sliders
├── hooks/
│   └── useKeyboardControls.js  # WASD/arrow key movement
└── App.jsx                     # Layout with SceneProvider wrapper
```

## Keyboard Controls (Director's Frame)

Click the Director's Frame viewport to focus, then:
- **WASD / Arrows**: Move forward/back/strafe left/right
- **Q/E**: Lower/raise camera height
- **R/F**: Tilt camera up/down
- **Z/X**: Pan camera left/right
- **Click outside**: Release focus

## Pending Features

### Phase 3: Entity System
- ⬜ GenericVolume component (labelled geometric primitives)
- ⬜ Entity selection and positioning
- ⬜ Facing indicator (yellow cone)

### Phase 4: Human Figures
- ⬜ Mannequin.js integration with R3F
- ⬜ Pose controls UI (Leva-based body part sliders)
- ⬜ Pose presets (T-pose, neutral, sitting, etc.)

### Phase 5: Export & Polish
- ⬜ PNG export from Director's Frame
- ⬜ Auto-generated cinematographic prompt
- ⬜ Lens preset buttons (24mm, 35mm, 50mm, etc.)

## Development

```bash
npm run dev    # Start dev server (localhost:5173)
npm run build  # Production build
```

## Technical Notes

- React 19 + Vite 6
- React Three Fiber ^9.x with Drei ^10.x
- Tailwind CSS v4 (via @tailwindcss/postcss)
- Mannequin.js loaded via npm package

## Bug Fixes Applied

1. **Frustum positioning** - CameraHelper now renders at correct world position by adding camera to scene graph (`group.add(cam)`) and forcing world matrix update
2. **Tailwind v4** - Using @tailwindcss/postcss plugin instead of direct tailwindcss

---

**Next Session**: Continue with Phase 3 (GenericVolume entity system)
