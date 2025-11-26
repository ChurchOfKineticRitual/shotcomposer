---
description: Test and refine the auto-generated cinematographic prompts
---

# Test Prompt Generation

Analyze and improve the prompt generation logic for AI image models.

1. **Read the cinematography reference:**
   - The tool should generate prompts using professional film language
   - Terms like: wide shot, medium close-up, low angle, eye level, foreground, midground

2. **Check the current implementation:**
   - Review src/utils/cinematography.js
   - Verify classifyShot(), classifyAngle(), describeDepth(), describeFacing()

3. **Test scenarios to verify:**
   - Camera at eye level looking at figure → should say "eye level"
   - Camera high looking down → should say "high angle"
   - Camera with low FOV → should say "close-up"
   - Figure near camera → should say "foreground"
   - Figure facing camera → should say "facing camera"

4. **Prompt format for NanoBanana:**
   The generated prompt should follow this pattern:
   - Shot type and angle first
   - Entity descriptions with depth and facing
   - Natural, descriptive language (not keywords)
   
   Example: "Medium shot from a low angle. In the foreground, a person standing with arm raised, facing camera. In the midground, a quadruped facing away."

5. **Consider enhancements:**
   - Describe pose more specifically (running, sitting, gesturing)
   - Include lighting suggestions based on scene setup
   - Add compositional notes (rule of thirds, leading lines)
