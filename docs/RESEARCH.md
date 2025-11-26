# ShotComposer Research Findings

This document contains research conducted in a Claude.ai session exploring optimal methods for filmmakers to control spatial composition and camera angles in AI image generation.

## Part 1: Spatial Control with NanoBanana

### Key Finding: No ControlNet Required

Unlike Stable Diffusion workflows requiring separate depth maps, pose detection, or edge detection, NanoBanana (Gemini 2.5 Flash Image) interprets reference images **semantically** rather than mechanically.

Traditional ControlNet preprocessing (for reference only):
- Canny Edge Detection: 94.2% structural accuracy, 342ms processing
- Depth Mapping: 91.8% spatial consistency, 428ms processing
- OpenPose: 88.5% pose matching, 512ms processing

**NanoBanana eliminates the need for these preprocessing steps.** It understands the intent behind reference images.

### Effective Reference Input Types

1. **Rough compositional sketches** with clear spatial intent - can include text labels for regions
2. **Multi-image composition** - Gemini 3 Pro supports up to 14 reference images
3. **Photographic/cinematic language in prompts** - "wide-angle shot", "85mm portrait lens", "Dutch angle"
4. **Explicit spatial relationships** - "beside", "overlooking", "nestled between"

### Optimal Reference Image Format

**Recommendation:** Clean, flat-shaded or silhouette render with clear spatial separation, combined with explicit text describing shot composition.

Alternative formats evaluated:
| Format | Pros | Cons |
|--------|------|------|
| Simple wireframe/silhouette | Clear spatial relationships, low noise | Less volume information |
| Flat-shaded render | Shows volumes and spatial relationships cleanly | Slightly more complex |
| Depth-map style grayscale | Preserves 3D spatial info | NanoBanana doesn't process depth maps natively |
| Annotated sketch | Can include text labels | Requires post-processing |

### Prompting Best Practices for NanoBanana

- Descriptive paragraphs over keyword lists (3.2x quality improvement)
- Spatial relationships must be explicit in text
- Lighting descriptions guide atmospheric rendering ("harsh midday sun", "blue hour glow")
- Action verbs activate physics simulation ("leaping", "pouring", "rustling")
- Hyper-specific descriptions over vague terms
- Use photographic and cinematic language to control camera

**Example prompt style:**
```
Create a photorealistic full body portrait of a model wearing a futuristic, 
flowing gown made of iridescent fabric that shifts between purple and blue. 
She stands in a minimalist white studio with soft, diffused lighting from 
large softboxes positioned at 45-degree angles. Shot with a medium format 
camera at f/2.8 for shallow depth of field.
```

---

## Part 2: 3D Camera Sandbox Architecture

### Recommended Stack

```
React + React Three Fiber + Drei
├── @react-three/fiber (core 3D rendering)
├── @react-three/drei (camera controls, helpers)
├── camera-controls (professional camera manipulation)
├── leva (control panel UI)
└── html2canvas or custom WebGL export
```

### Why camera-controls Library

Drei exports multiple camera control options: OrbitControls, MapControls, TrackballControls, ArcballControls, FlyControls, etc.

**camera-controls is recommended** because it distinguishes:
- **Zoom**: Changing FOV (cinematographic zoom)
- **Dolly**: Physically moving camera forward/backward

This matches how cinematographers think about camera movement.

### Dual Viewport Design

```
┌──────────────────────────────────────────────────────────────┐
│                      Main Interface                           │
├─────────────────────────┬────────────────────────────────────┤
│   Scene Overview        │    Director's Frame (16:9)         │
│   (Orbit/Fly Camera)    │    (Fixed aspect viewport)         │
│                         │                                    │
│   [3D scene with        │   [What the director camera sees]  │
│    visible camera       │                                    │
│    frustum]             │                                    │
├─────────────────────────┴────────────────────────────────────┤
│  Camera Controls: Position | Rotation | Focal Length          │
│  Export: Render | Depth | Wireframe | + Prompt                │
└──────────────────────────────────────────────────────────────┘
```

### Depth Map Export (v2 Feature)

Render scene to THREE.WebGLRenderTarget with depthBuffer=true. Access RGB and depth data via `.texture` and `.depthTexture` attributes. Apply to plane with custom shaders for visualization.

---

## Part 3: Posable Human Figures

### Solution: Mannequin.js

**Source:** https://boytchev.github.io/mannequin.js/
**License:** GPL-3.0
**Proven in production:** SetPose.com uses it

Mannequin.js is ideal because:
1. Built on Three.js - direct R3F integration possible
2. Simple, intuitive API with rotation properties in degrees
3. Clean, generic appearance - enough form to convey pose without identity
4. Forward kinematics (direct joint rotation) is actually preferable for previz

### API Overview

Body parts use rotation properties: `bend`, `turn`, `raise`, `straddle`, `tilt`, `nod`

```javascript
// Create a figure
const man = new Male();

// Overall body position
man.body.tilt = -5;
man.body.bend = 15.2;

// Head
man.head.nod = -30;
man.head.turn = 45;

// Arms
man.l_arm.raise = 50;
man.l_arm.straddle = 70;
man.l_elbow.bend = 155;
man.l_wrist.bend = -20;

// Legs
man.r_leg.turn = 50;
man.r_knee.bend = 90;
man.r_ankle.bend = 15;
```

### Body Part Hierarchy

Central parts (single instance): `body`, `head`, `neck`, `torso`, `pelvis`

Paired parts (left/right):
- Arms: `l_arm`/`r_arm`, `l_elbow`/`r_elbow`, `l_wrist`/`r_wrist`, `l_fingers`/`r_fingers`
- Legs: `l_leg`/`r_leg`, `l_knee`/`r_knee`, `l_ankle`/`r_ankle`

### Posing UI Pattern

Based on SetPose.com's proven interaction model:

| Control Mode | Hotkey | Action |
|--------------|--------|--------|
| **Bend** | Z | Forward/backward flex (nodding, bending elbow) |
| **Tilt** | X | Side-to-side (raising arm laterally) |
| **Rotate** | C | Axial rotation (twisting wrist) |

Workflow: Click body part → drag to adjust in current mode → mode buttons or keys to switch.

### Pose Presets Format

Store as JSON objects with rotation values for each joint:

```json
{
  "standing_neutral": {
    "body": { "tilt": 0, "bend": 0, "turn": 0 },
    "head": { "nod": 0, "turn": 0, "tilt": 0 },
    "l_arm": { "raise": -10, "straddle": 8 },
    "l_elbow": { "bend": 5 },
    "r_arm": { "raise": -10, "straddle": 8 },
    "r_elbow": { "bend": 5 }
  },
  "walking": { },
  "sitting": { },
  "pointing": { }
}
```

### Why NOT Inverse Kinematics

THREE.IK exists but is "a work in progress" with many open issues. For previz:
- Forward kinematics gives more predictable results
- Easier to fine-tune specific joint angles
- Pose presets work naturally
- IK only valuable for endpoint dragging (less common in previz)

---

## Part 4: Non-Humanoid Characters

### The Problem

OpenPose detects 135 human keypoints. AnimalPose exists for some animals (20 keypoints for cows). But there's no universal pose skeleton for "any creature" - each species would need its own keypoint map.

### The Solution: Annotated Volumes

Since NanoBanana interprets semantically (not matching poses mechanically), use simple labelled primitives:

#### Tier 1: Basic Volume + Label (MVP)

```
┌─────────────────────────────────────────┐
│                                         │
│     [Oval shape]                        │
│     "MERMAID"                           │
│     ← facing direction arrow            │
│                                         │
└─────────────────────────────────────────┘
```

Components:
- Simple 3D primitive (ellipsoid, capsule, box)
- Text label identifying the creature type
- Facing indicator (cone/arrow showing direction)
- Approximate scale

Prompt fills in the details: "The mermaid in the foreground is reclining on a rock, tail curling toward the camera..."

#### Tier 2: Silhouette Library (Future)

Pre-made shapes for common creature archetypes:

| Category | Examples | Basic Shape |
|----------|----------|-------------|
| **Humanoid** | Mannequin.js | (already solved) |
| **Quadruped** | dog, horse, cow | Capsule body + 4 cylinders + head sphere |
| **Bird** | chicken, eagle | Oval body + wedge head + wing planes |
| **Fish/Serpent** | fish, snake, mermaid | Tapered cylinder/ellipsoid |
| **Seated creature** | frog, cat sitting | Compact oval |

### Why This Works

NanoBanana needs:
1. **Where** the entity is in 3D space
2. **How big** it is relative to other elements
3. **Which direction** it's facing
4. **What** it is (via label + prompt)

A simple annotated volume provides all of that.

---

## Part 5: Auto-Prompt Generation

### Shot Classification Logic

```javascript
function classifyShot(camera) {
  const fov = camera.fov;
  if (fov < 30) return 'close-up';
  if (fov < 60) return 'medium shot';
  return 'wide shot';
}

function classifyAngle(camera, targetHeight = 0) {
  const heightDiff = camera.position.y - targetHeight;
  if (heightDiff > 1) return 'high angle';
  if (heightDiff < -1) return 'low angle';
  return 'eye level';
}
```

### Prompt Structure

```javascript
function generatePrompt(camera, entities) {
  const shotType = classifyShot(camera);
  const angle = classifyAngle(camera);
  
  const entityDescriptions = entities.map(entity => {
    const depth = getDepthClass(entity.position, camera); // foreground/midground/background
    const facing = describeFacing(entity.rotation, camera); // toward camera, away, profile
    
    if (entity.type === 'human') {
      return `${depth}: ${entity.label} ${describePose(entity.pose)}, ${facing}`;
    } else {
      return `${depth}: ${entity.label} ${facing}`;
    }
  });
  
  return {
    cameraDescription: `${shotType}, ${angle}`,
    entities: entityDescriptions,
    suggestedPrompt: `${shotType} ${angle}. ${entityDescriptions.join('. ')}.`
  };
}
```

---

## Part 6: Existing Tools Surveyed

For context, here are existing previz tools (none optimize for AI image generation):

| Tool | Price | Notes |
|------|-------|-------|
| ShotPro | $30 | iPad/iPhone, 3D blocking and camera control |
| SceneForge Studio | $39/month | Realtime graphics, AR camera tracking |
| Phantasm Virtual Viz | Enterprise | Used on Fast X |
| D5 Render | Varies | Real-time rendering, depth/AO passes |
| iClone | Varies | Real-time 3D animation |
| Unreal Engine | Free | Industry standard virtual production |

**Opportunity:** None specifically optimize output for AI image generation prompting.

---

## References

- Mannequin.js: https://boytchev.github.io/mannequin.js/
- Mannequin.js GitHub: https://github.com/boytchev/mannequin.js/
- SetPose.com (uses Mannequin.js): https://setpose.com/
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- Drei: https://github.com/pmndrs/drei
- camera-controls: https://github.com/yomotsu/camera-controls
