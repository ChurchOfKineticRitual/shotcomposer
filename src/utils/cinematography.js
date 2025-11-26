// cinematography.js - Shot classification and prompt generation

/**
 * Classify shot type based on FOV
 * @param {number} fov - Field of view in degrees
 * @returns {string} Shot type classification
 */
export function classifyShot(fov) {
  if (fov < 25) return 'extreme close-up';
  if (fov < 35) return 'close-up';
  if (fov < 50) return 'medium close-up';
  if (fov < 65) return 'medium shot';
  if (fov < 80) return 'medium wide shot';
  if (fov < 100) return 'wide shot';
  return 'extreme wide shot';
}

/**
 * Classify camera angle based on Y position relative to subject
 * @param {number} cameraY - Camera Y position
 * @param {number} targetY - Target Y position (default: 1.6m for human eye level)
 * @returns {string} Angle classification
 */
export function classifyAngle(cameraY, targetY = 1.6) {
  const diff = cameraY - targetY;
  if (diff > 2) return "bird's eye view";
  if (diff > 0.5) return 'high angle';
  if (diff < -2) return "worm's eye view";
  if (diff < -0.5) return 'low angle';
  return 'eye level';
}

/**
 * Describe entity depth in frame based on distance from camera
 * @param {number} entityZ - Entity Z position
 * @param {number} cameraZ - Camera Z position
 * @returns {string} Depth classification
 */
export function describeDepth(entityZ, cameraZ) {
  const distance = Math.abs(entityZ - cameraZ);
  if (distance < 3) return 'foreground';
  if (distance < 8) return 'midground';
  return 'background';
}

/**
 * Convert FOV to 35mm equivalent focal length
 * @param {number} fov - Field of view in degrees
 * @param {number} sensorSize - Sensor size in mm (default: 36mm for full frame)
 * @returns {number} Focal length in mm
 */
export function fovToFocalLength(fov, sensorSize = 36) {
  return Math.round((sensorSize / 2) / Math.tan((fov * Math.PI) / 360));
}

/**
 * Describe entity facing direction relative to camera
 * @param {number} entityRotationY - Entity Y rotation in radians
 * @param {Array<number>} cameraPosition - Camera position [x, y, z]
 * @param {Array<number>} entityPosition - Entity position [x, y, z]
 * @returns {string} Facing description
 */
export function describeFacing(entityRotationY, cameraPosition, entityPosition) {
  // Calculate angle from entity to camera
  const toCameraAngle = Math.atan2(
    cameraPosition[0] - entityPosition[0],
    cameraPosition[2] - entityPosition[2]
  );

  const entityFacing = entityRotationY;
  let angleDiff = Math.abs(toCameraAngle - entityFacing);

  // Normalize angle difference to 0-PI range
  if (angleDiff > Math.PI) {
    angleDiff = 2 * Math.PI - angleDiff;
  }

  if (angleDiff < Math.PI / 6) return 'facing camera';
  if (angleDiff > Math.PI * 5 / 6) return 'facing away';
  if (angleDiff < Math.PI / 2) return 'three-quarter view';
  return 'profile view';
}

/**
 * Describe pose in natural language
 * @param {Object} pose - Mannequin.js pose object
 * @returns {string} Natural language pose description
 */
export function describePose(pose) {
  if (!pose) return 'standing';

  const descriptions = [];

  // Check arms
  const leftArmRaised = (pose.l_arm?.raise || 0) > 60;
  const rightArmRaised = (pose.r_arm?.raise || 0) > 60;
  const leftElbowBent = (pose.l_elbow?.bend || 0) > 90;
  const rightElbowBent = (pose.r_elbow?.bend || 0) > 90;

  if (leftArmRaised && rightArmRaised) {
    descriptions.push('both arms raised');
  } else if (leftArmRaised) {
    descriptions.push('left arm raised');
  } else if (rightArmRaised) {
    descriptions.push('right arm raised');
  }

  if (leftElbowBent || rightElbowBent) {
    descriptions.push('arm bent at elbow');
  }

  // Check legs
  const leftLegRaised = (pose.l_leg?.raise || 0) > 30;
  const rightLegRaised = (pose.r_leg?.raise || 0) > 30;
  const leftKneeBent = (pose.l_knee?.bend || 0) > 60;
  const rightKneeBent = (pose.r_knee?.bend || 0) > 60;

  if (leftLegRaised || rightLegRaised) {
    descriptions.push('leg lifted');
  }

  if (leftKneeBent && rightKneeBent) {
    descriptions.push('crouching');
  } else if (leftKneeBent || rightKneeBent) {
    descriptions.push('knee bent');
  }

  // Check body
  const bodyBend = pose.body?.bend || 0;
  if (Math.abs(bodyBend) > 20) {
    descriptions.push(bodyBend > 0 ? 'leaning forward' : 'leaning back');
  }

  const bodyTurn = pose.body?.turn || 0;
  if (Math.abs(bodyTurn) > 30) {
    descriptions.push('torso turned');
  }

  // Check head
  const headTurn = pose.head?.turn || 0;
  if (Math.abs(headTurn) > 30) {
    descriptions.push('head turned');
  }

  const headNod = pose.head?.nod || 0;
  if (headNod > 20) {
    descriptions.push('looking down');
  } else if (headNod < -20) {
    descriptions.push('looking up');
  }

  return descriptions.length > 0 ? descriptions.join(', ') : 'standing';
}

/**
 * Generate cinematographic prompt for NanoBanana/Gemini
 * @param {Object} camera - Director camera state with position, rotation, fov
 * @param {Array<Object>} entities - Array of entity objects
 * @returns {Object} Prompt data with shot type, angle, focal length, and full description
 */
export function generatePrompt(camera, entities) {
  const shotType = classifyShot(camera.fov);
  const angle = classifyAngle(camera.position[1]);
  const focalLength = fovToFocalLength(camera.fov);

  // Sort entities by depth for natural description order
  const sortedEntities = [...entities].sort((a, b) => {
    const depthA = describeDepth(a.position[2], camera.position[2]);
    const depthB = describeDepth(b.position[2], camera.position[2]);
    const depthOrder = { foreground: 0, midground: 1, background: 2 };
    return depthOrder[depthA] - depthOrder[depthB];
  });

  const entityDescriptions = sortedEntities.map(entity => {
    const depth = describeDepth(entity.position[2], camera.position[2]);
    const facing = describeFacing(
      entity.rotation?.[1] || 0,
      camera.position,
      entity.position
    );

    if (entity.type === 'human') {
      const poseDesc = describePose(entity.pose);
      const label = entity.label || 'person';
      return `In the ${depth}, ${label.toLowerCase()} ${poseDesc}, ${facing}`;
    } else {
      const label = entity.label || 'object';
      return `In the ${depth}, ${label.toLowerCase()} ${facing}`;
    }
  });

  // Build full prompt
  let fullPrompt = `A ${shotType} from ${angle}`;

  if (entityDescriptions.length > 0) {
    fullPrompt += `. ${entityDescriptions.join('. ')}.`;
  } else {
    fullPrompt += '. Empty scene.';
  }

  // Add technical details for AI model
  fullPrompt += ` Shot on ${focalLength}mm lens. Cinematic composition, professional lighting, photorealistic.`;

  return {
    shotType,
    angle,
    focalLength,
    entities: entityDescriptions,
    full: fullPrompt,
  };
}
