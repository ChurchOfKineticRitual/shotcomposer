# ShotComposer - Task List

## Status: Feature Complete ✅

All MVP development phases complete. Ready for deployment.

---

## Completed Tasks

### Development (All Phases Complete)
- [x] Phase 1: Core Viewport System
  - [x] Implement dual viewport with R3F Views (Scene Overview + Director's Frame)
  - [x] Add DirectorCamera with adjustable position/rotation/FOV
  - [x] Render camera frustum in Scene Overview

- [x] Phase 2: Entity System
  - [x] Create HumanFigure wrapper around Mannequin.js
  - [x] Build PoseControls UI for body parts
  - [x] Implement entity selection and positioning
  - [x] Add GenericVolume for non-human entities
  - [x] Add facing indicators
  - [x] Create creature template library

- [x] Phase 3: Export & Prompts
  - [x] PNG capture from director camera
  - [x] Depth map export
  - [x] Auto-generate cinematographic prompts
  - [x] Shot classification (wide, medium, close-up)

- [x] Phase 4: Polish
  - [x] Pose preset library (save/load)
  - [x] Keyboard shortcuts (WASD/Q/E/Arrows + Alt)
  - [x] Fine movement controls

### Repository & Deployment Setup
- [x] Update CLAUDE.md with complete state
- [x] Initialize git repository
- [x] Create initial commit
- [x] Create GitHub repository (https://github.com/ChurchOfKineticRitual/shotcomposer)
- [x] Push code to GitHub
- [x] Add Netlify MCP server
- [x] Authenticate with Netlify
- [x] Document Netlify deployment settings

### Bug Fixes
- [x] PostCSS/Tailwind v4 Configuration
- [x] Mannequin.js Loading
- [x] Three.js Object Duplication (React StrictMode + HMR)
- [x] Camera Frustum Positioning

---

## Current Tasks

### Deployment
- [ ] Deploy to Netlify via web interface
  - Go to: https://app.netlify.com/
  - Click "Add new site" → "Import an existing project"
  - Connect to GitHub: `ChurchOfKineticRitual/shotcomposer`
  - Build settings:
    - Base directory: (leave empty)
    - Build command: `npm run build`
    - Publish directory: `dist`
    - Node version: 22.x
  - Environment variables: None needed
  - Deploy!

- [ ] Verify deployment
  - [ ] Test dual viewports render correctly
  - [ ] Test keyboard controls work
  - [ ] Test adding human figures
  - [ ] Test adding volumes
  - [ ] Test pose controls
  - [ ] Test PNG export
  - [ ] Test depth map export
  - [ ] Test prompt generation

---

## Future Enhancements (Optional - Post-Launch)

### Content
- [ ] Additional pose presets
  - [ ] Action poses (running, jumping, fighting)
  - [ ] Emotional poses (celebrating, defeated, thinking)
  - [ ] Interaction poses (handshake, conversation, pointing)
- [ ] More creature templates
  - [ ] Insects (butterfly, bee, spider)
  - [ ] Aquatic (fish, shark, whale, dolphin)
  - [ ] Mythical (dragon, unicorn, griffin)

### Features
- [ ] Lighting presets
  - [ ] Time of day (dawn, noon, dusk, night)
  - [ ] Mood (dramatic, soft, hard, noir)
  - [ ] Color temperature controls
- [ ] Scene management
  - [ ] Save/load scene configurations
  - [ ] Export scene as JSON
  - [ ] Import scene from JSON
- [ ] Camera presets
  - [ ] Common focal lengths (24mm, 35mm, 50mm, 85mm)
  - [ ] Cinematic aspect ratios (2.35:1, 2.39:1, etc.)
- [ ] URL sharing
  - [ ] Encode scene in URL parameters
  - [ ] Share composed shots via link

### Polish
- [ ] Undo/redo functionality
- [ ] Keyboard shortcut reference panel
- [ ] Tutorial/onboarding overlay
- [ ] Performance optimizations for many entities
- [ ] Mobile/touch controls

---

## Notes

**Last Updated:** 2025-11-26

**GitHub:** https://github.com/ChurchOfKineticRitual/shotcomposer

**Next Session:** Deploy to Netlify and verify production build
