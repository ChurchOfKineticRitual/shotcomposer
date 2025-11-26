// RenderExport.jsx - PNG capture from director camera
import { useState } from 'react'
import { useRenderCapture } from '../../context/RenderCaptureContext'

const RESOLUTION_PRESETS = [
  { label: '1080p (1920x1080)', width: 1920, height: 1080 },
  { label: '720p (1280x720)', width: 1280, height: 720 },
  { label: '4K (3840x2160)', width: 3840, height: 2160 },
  { label: '2K (2560x1440)', width: 2560, height: 1440 },
]

export default function RenderExport() {
  const { captureFrame, isReady } = useRenderCapture()
  const [selectedResolution, setSelectedResolution] = useState(0)
  const [isCapturing, setIsCapturing] = useState(false)

  const handleExport = async () => {
    if (!isReady || isCapturing) return

    setIsCapturing(true)
    try {
      const preset = RESOLUTION_PRESETS[selectedResolution]
      await captureFrame(preset.width, preset.height)
    } catch (error) {
      console.error('Failed to capture frame:', error)
      alert('Failed to capture image. Please try again.')
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700">
      <h3 className="text-sm font-semibold mb-3">Export Reference Image</h3>

      {/* Resolution selector */}
      <div className="mb-3">
        <label className="block text-xs text-gray-400 mb-1">
          Resolution
        </label>
        <select
          value={selectedResolution}
          onChange={(e) => setSelectedResolution(Number(e.target.value))}
          className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500"
          disabled={isCapturing}
        >
          {RESOLUTION_PRESETS.map((preset, index) => (
            <option key={index} value={index}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>

      {/* Export button */}
      <button
        onClick={handleExport}
        disabled={!isReady || isCapturing}
        className={`w-full px-4 py-2 rounded text-sm font-medium transition-colors ${
          !isReady || isCapturing
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isCapturing ? 'Capturing...' : 'Export PNG'}
      </button>

      {!isReady && (
        <p className="mt-2 text-xs text-gray-500">
          Waiting for scene to initialize...
        </p>
      )}
    </div>
  )
}
