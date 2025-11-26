---
description: Implement a new feature following ShotComposer architecture patterns
---

# Implement Feature

Before implementing the feature "$ARGUMENTS":

1. **Read the relevant documentation:**
   - Read CLAUDE.md for project overview and architecture
   - Read docs/TECHNICAL_SPEC.md for implementation patterns
   - If involving mannequins, read docs/MANNEQUIN_INTEGRATION.md

2. **Plan the implementation:**
   - Identify which components need to be created/modified
   - Determine state changes needed
   - Consider how this integrates with existing features

3. **Follow the architecture:**
   - Components in src/components/ following the established structure
   - Hooks in src/hooks/ for reusable logic
   - Utils in src/utils/ for pure functions
   - Use Leva for debug controls during development

4. **Implementation guidelines:**
   - Use functional components with hooks
   - Keep components focused (single responsibility)
   - Test in both viewports (scene overview + director frame)
   - Ensure PNG export still works after changes

5. **After implementation:**
   - Run `npm run dev` to test
   - Verify the feature works in both viewports
   - Check that existing features still work
