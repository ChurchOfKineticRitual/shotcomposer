# ShotComposer - Current Tasks

## Blocking Issues

*All blocking issues resolved as of 2025-11-26*

- [x] PostCSS/Tailwind v4 Configuration - Fixed by installing `@tailwindcss/postcss`
- [x] Mannequin.js Loading - Fixed by using `mannequin-js` npm package
- [x] CSS 500 Error - Resolved with PostCSS fix

## Next Steps

### Phase 1: Core Viewport System
- [ ] Implement dual viewport with R3F Views (Scene Overview + Director's Frame)
- [ ] Add DirectorCamera with adjustable position/rotation/FOV
- [ ] Render camera frustum in Scene Overview

### Phase 2: Entity System
- [ ] Create HumanFigure wrapper around Mannequin.js
- [ ] Build PoseControls UI for body parts
- [ ] Implement entity selection and positioning
- [ ] Add GenericVolume for non-human entities

### Phase 3: Export & Prompts
- [ ] PNG capture from director camera
- [ ] Auto-generate cinematographic prompts
- [ ] Shot classification (wide, medium, close-up)

### Phase 4: Polish
- [ ] Pose preset library (save/load)
- [ ] Leva debug controls
- [ ] Keyboard shortcuts
