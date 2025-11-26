// CameraUI.jsx - Position/rotation/FOV controls
import { useDirectorCamera } from '../context/SceneContext'

function SliderControl({ label, value, onChange, min, max, step = 0.1 }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-400 w-8">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
      />
      <span className="text-xs text-gray-300 w-12 text-right">{value.toFixed(1)}</span>
    </div>
  )
}

export default function CameraUI() {
  const { camera, setPosition, setRotation, setFov } = useDirectorCamera()

  const updatePosition = (index, value) => {
    const newPos = [...camera.position]
    newPos[index] = value
    setPosition(newPos)
  }

  const updateRotation = (index, value) => {
    const newRot = [...camera.rotation]
    newRot[index] = value
    setRotation(newRot)
  }

  return (
    <div className="p-4 bg-gray-800 border-b border-gray-700">
      <h3 className="text-sm font-medium mb-3">Camera Controls</h3>

      {/* Position */}
      <div className="mb-4">
        <h4 className="text-xs text-gray-500 uppercase mb-2">Position</h4>
        <div className="space-y-2">
          <SliderControl
            label="X"
            value={camera.position[0]}
            onChange={(v) => updatePosition(0, v)}
            min={-10}
            max={10}
          />
          <SliderControl
            label="Y"
            value={camera.position[1]}
            onChange={(v) => updatePosition(1, v)}
            min={0}
            max={10}
          />
          <SliderControl
            label="Z"
            value={camera.position[2]}
            onChange={(v) => updatePosition(2, v)}
            min={-10}
            max={15}
          />
        </div>
      </div>

      {/* Rotation */}
      <div className="mb-4">
        <h4 className="text-xs text-gray-500 uppercase mb-2">Rotation (rad)</h4>
        <div className="space-y-2">
          <SliderControl
            label="X"
            value={camera.rotation[0]}
            onChange={(v) => updateRotation(0, v)}
            min={-Math.PI / 2}
            max={Math.PI / 2}
            step={0.01}
          />
          <SliderControl
            label="Y"
            value={camera.rotation[1]}
            onChange={(v) => updateRotation(1, v)}
            min={-Math.PI}
            max={Math.PI}
            step={0.01}
          />
        </div>
      </div>

      {/* FOV */}
      <div>
        <h4 className="text-xs text-gray-500 uppercase mb-2">Field of View</h4>
        <SliderControl
          label="FOV"
          value={camera.fov}
          onChange={setFov}
          min={15}
          max={120}
          step={1}
        />
        <div className="text-xs text-gray-500 mt-1">
          ~{Math.round((36 / 2) / Math.tan((camera.fov * Math.PI) / 360))}mm equivalent
        </div>
      </div>
    </div>
  )
}
