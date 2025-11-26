---
description: Create a new pose preset for Mannequin.js figures
---

# Add Pose Preset

Create a new pose preset named "$ARGUMENTS".

1. **Read the Mannequin.js integration guide:**
   - Read docs/MANNEQUIN_INTEGRATION.md for body part properties

2. **Define the pose:**
   Create a JSON object with the following structure:
   ```json
   {
     "body": { "tilt": 0, "bend": 0, "turn": 0 },
     "head": { "nod": 0, "turn": 0, "tilt": 0 },
     "torso": { "bend": 0, "turn": 0, "tilt": 0 },
     "l_arm": { "raise": 0, "straddle": 0, "turn": 0 },
     "l_elbow": { "bend": 0 },
     "r_arm": { "raise": 0, "straddle": 0, "turn": 0 },
     "r_elbow": { "bend": 0 },
     "l_leg": { "raise": 0, "straddle": 0, "turn": 0 },
     "l_knee": { "bend": 0 },
     "r_leg": { "raise": 0, "straddle": 0, "turn": 0 },
     "r_knee": { "bend": 0 }
   }
   ```

3. **Consider the pose semantics:**
   - What does this pose convey?
   - Is it natural and physically possible?
   - What would a filmmaker use this for?

4. **Add to src/data/posePresets.json**

5. **Test the pose:**
   - Apply it to a mannequin in the scene
   - Verify it looks correct from multiple angles
