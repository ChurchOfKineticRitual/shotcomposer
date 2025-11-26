# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ShotComposer

A 3D camera sandbox for filmmakers to compose shots and generate AI image prompts. Users position cameras, place posable human figures and entity volumes, then export reference images + auto-generated cinematographic prompts for use with generative AI models (especially NanoBanana/Gemini 2.5 Flash Image).

## Commands

- `npm run dev` - Start development server (Vite on localhost:5173)
- `npm run build` - Production build
- `npm run preview` - Preview production build

## Tech Stack

- **Framework**: React 19 with Vite 6
- **3D Engine**: React Three Fiber (@react-three/fiber ^9.x)
- **3D Utilities**: Drei (@react-three/drei ^10.x)
- **Camera Controls**: camera-controls library
- **UI Controls**: Leva for control panels
- **Posable Figures**: Mannequin.js (mannequin-js package) - [API docs](https://boytchev.github.io/mannequin.js/)
- **Styling**: Tailwind CSS v4

## MCP Servers

Three MCP servers are configured. Use them explicitly:

| Server | When to Use | Example |
|--------|-------------|---------|
| **Playwright** | Verify UI renders correctly | `Use playwright to open localhost:5173 and check the viewports` |
| **Context7** | Get current library docs | `How do I use Drei View? use context7` |
| **Sequential Thinking** | Complex architectural decisions | `Use sequential thinking to plan the state management` |

Always use **context7** when working with: React Three Fiber, Three.js, Drei, Leva, camera-controls.

## Architecture

### App Layout (`src/App.jsx`)
- Left sidebar: CameraUI, EntityManager, PromptGenerator, RenderExport
- Main area: SceneCanvas with dual viewports

### Dual Viewport System (`src/components/SceneCanvas.jsx`)
Uses Drei's `View` component for split viewports sharing one Canvas:
1. **Scene Overview** (left): Orbit camera showing entire scene with visible camera frustum
2. **Director's Frame** (right): Fixed 16:9 aspect ratio showing what the director camera sees

### State Management
**SceneContext** (`src/context/SceneContext.jsx`) - Context + useReducer pattern:
- `entities[]` - Scene entities with id, type, position, rotation, pose/label
- `selectedEntityId` - Currently selected entity
- `directorCamera` - Position, rotation, FOV
- Custom hooks: `useScene()`, `useDirectorCamera()`, `useEntities()`

Entity types in state:
- `human`: `{ figureType, pose, position, rotation, label }`
- `volume`: `{ shape, dimensions: {width, height, depth}, showBeak, label, position, facing }`

**RenderCaptureContext** (`src/context/RenderCaptureContext.jsx`) - Manages PNG/depth render capture:
- Exposes `triggerCapture()` function to initiate render
- RenderCapture component (inside Canvas) listens for trigger and captures frame
- Custom hook: `useRenderCapture()`

### Key Components
- `DirectorCamera.jsx` - Camera view + frustum visualization (updates via useFrame)
- `useKeyboardControls.js` - WASD=position, Q/E=height, Arrows=angle, Alt=fine (when Director's Frame focused)
- `entities/HumanFigure.jsx` - Mannequin.js wrapper with pose application
- `entities/GenericVolume.jsx` - Labelled geometric primitives for non-humans
- `entities/PoseControls.jsx` - UI for posing human figures (body part sliders, pose presets)
- `entities/VolumeControls.jsx` - UI for configuring volumes (shape, dimensions, creature templates)
- `entities/FacingIndicator.jsx` - Yellow cone showing entity facing direction
- `export/RenderExport.jsx` - PNG + depth map capture from director camera
- `export/RenderCapture.jsx` - In-Canvas component that performs actual render capture
- `export/PromptGenerator.jsx` - Auto-generated shot description with metadata
- `utils/cinematography.js` - Shot/angle classification, prompt generation
- `hooks/useMannequin.js` - Mannequin.js lifecycle management with cleanup
- `hooks/usePosePresets.js` - Load and manage pose preset library
- `hooks/useDepthRender.js` - Render depth maps for AI image generation

### Data Files
- `src/data/posePresets.json` - Library of named poses (T-pose, neutral, sitting, waving, etc.)
- `src/data/creatureTemplates.json` - Volume configurations for common creatures (dog, cat, horse, bird, etc.)

### Mannequin.js Integration
```javascript
import { Male, Female, Child } from 'mannequin-js/src/bodies/...';
```
- Pose format: `{ l_arm: { raise: 45, straddle: 10 }, l_elbow: { bend: 90 }, ... }`
- Full API reference: `docs/MANNEQUIN_INTEGRATION.md`
- The `useMannequin` hook handles cleanup of mannequin.js internal scene and auto-created renderer

### Slash Commands
- `/resume` - Analyze project state, update docs if needed, continue with next logical steps
- `/implement <feature>` - Implement new feature following architecture patterns
- `/add-pose <name>` - Create a new pose preset for Mannequin.js figures
- `/setup` - Initialize project from scratch (fresh install only)
- `/test-prompts` - Test and refine cinematographic prompt generation

## Key Implementation Notes

**Canvas z-index**: The Canvas must have `zIndex: 20` to render above View containers (which have `z-10`)

**Mannequin.js cleanup**: The library auto-adds figures to its internal scene and creates its own renderer. The `useMannequin` hook removes figures from the internal scene and cleans up the auto-created renderer.

**Fine movement modifier**: Use Alt key as modifier for slow/fine movement across all controls

**Drei Views** (Critical): Drei's `View` component creates **isolated scenes** per viewport. Content must be INSIDE each View to be visible. DO NOT put shared scene content at Canvas level outside View.Port.

```jsx
// CORRECT - Content inside each View
function SceneOverviewContent() {
  return (
    <>
      <SharedScene />  {/* Must be here */}
      <PerspectiveCamera />
      <OrbitControls />
    </>
  )
}

// WRONG - Content at Canvas level won't appear in Views
<Canvas>
  <SharedScene />  {/* Not visible in Views! */}
  <View.Port />
</Canvas>
```

**React StrictMode + Three.js**: Use `isInitializedRef` pattern to prevent double-creation of Three.js objects during StrictMode double-mount cycles.

**Vite HMR + Three.js**: When creating Three.js objects in hooks, also clear existing children before creating new ones (`while (groupRef.current.children.length > 0) groupRef.current.remove(...)`). For module-level singletons like mannequinScene, use `import.meta.hot.accept()` to re-run cleanup on HMR.

**Human figure Y position**: Default spawn position is `[0, 1, 0]` so feet are on the ground plane (Mannequin.js origin is at pelvis, ~1 unit above feet).

## Do Not

- Don't add IK (inverse kinematics) - forward kinematics is sufficient
- Don't create complex rigged animal models - use labelled volumes
- Don't fight for pixel-perfect pose matching - NanoBanana is semantic
- Don't over-engineer - MVP first, iterate based on real usage

## Reference Documents

- `docs/TECHNICAL_SPEC.md` - Implementation patterns with code examples
- `docs/MANNEQUIN_INTEGRATION.md` - Mannequin.js API and pose format
- `docs/RESEARCH.md` - Research findings on AI image generation workflow

## Troubleshooting: Three.js Object Duplication

A persistent bug caused human figures and camera frustums to appear twice - one at the original position that never updated, plus a duplicate that responded to edits. This was caused by **two separate issues**:

### Issue 1: React StrictMode Double-Mount
React 18+ in StrictMode intentionally double-mounts components. Without guards, useEffect hooks that create Three.js objects would create them twice.

**Solution**: Add `isInitializedRef` guard pattern:
```javascript
const isInitializedRef = useRef(false)

useEffect(() => {
  if (isInitializedRef.current) return  // Skip if already initialized
  isInitializedRef.current = true

  // Create Three.js objects here...

  return () => {
    // Cleanup...
    isInitializedRef.current = false
  }
}, [])
```

### Issue 2: Vite HMR Preserving Stale Objects
Hot Module Reload updates components without fully remounting them. Old Three.js objects could persist in group refs even after code changes.

**Solution**: Clear existing children before creating new ones:
```javascript
// At start of useEffect, after guard check
while (groupRef.current.children.length > 0) {
  groupRef.current.remove(groupRef.current.children[0])
}
```

For module-level singletons (like mannequinScene), use Vite's HMR API:
```javascript
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    // Re-run cleanup when module is hot-reloaded
    cleanupMannequinGlobals()
  })
}
```

### Files with this pattern
- `src/hooks/useMannequin.js` - Human figure creation
- `src/components/DirectorCamera.jsx` - Camera frustum creation

## Current State (2025-11-26)

**Feature Complete** - All MVP features implemented and stable:
- ✅ Dual viewport system with Scene Overview + Director's Frame
- ✅ Director camera with keyboard controls (WASD/Q/E/Arrows + Alt for fine movement)
- ✅ Human figures with Mannequin.js (Male, Female, Child) and full pose controls
- ✅ Generic volumes for non-human entities (box, sphere, cylinder, cone) with facing indicators
- ✅ Entity management (add, select, position, remove)
- ✅ PNG export from director camera
- ✅ Auto-generated cinematographic prompts with shot classification
- ✅ Pose presets library (T-pose, neutral, sitting, waving, etc.)
- ✅ Render depth maps for enhanced AI image generation

No known bugs. All viewports render correctly, entities don't duplicate, camera frustum updates properly.

## Next Steps

1. GitHub integration - Initialize repository and push code
2. Deployment - Set up Netlify deployment via GitHub
3. Optional enhancements:
   - Additional pose presets based on user feedback
   - Creature templates library expansion
   - Lighting presets for different moods/times of day
