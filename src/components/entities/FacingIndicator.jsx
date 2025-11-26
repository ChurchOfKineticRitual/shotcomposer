// FacingIndicator.jsx - Cone showing entity facing direction ("beak")

/**
 * Yellow cone that indicates which direction an entity is facing
 * Points along +Z axis (forward direction)
 *
 * @param {[number, number, number]} position - Position offset from parent center
 */
export default function FacingIndicator({ position = [0, 0, 0.6] }) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <coneGeometry args={[0.08, 0.2, 8]} />
      <meshStandardMaterial color="#facc15" />
    </mesh>
  );
}
