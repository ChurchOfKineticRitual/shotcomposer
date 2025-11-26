// SceneCanvas.jsx - R3F canvas with dual viewport system
import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { View, OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei'
import { DirectorCameraFrustum, DirectorCameraView } from './DirectorCamera'
import { useKeyboardControls } from '../hooks/useKeyboardControls'
import { useEntities } from '../context/SceneContext'
import HumanFigure from './entities/HumanFigure'
import GenericVolume from './entities/GenericVolume'
import RenderCapture from './export/RenderCapture'

// Shared scene content - rendered inside each View for proper visibility
function SharedScene() {
  const { entities, selectedEntityId, selectEntity } = useEntities()

  return (
    <>
      {/* Sky background - subtle gradient feel via fog */}
      <color attach="background" args={['#1a1a2e']} />
      <fog attach="fog" args={['#1a1a2e', 20, 60]} />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <hemisphereLight args={['#4a5568', '#2d3748', 0.3]} />

      {/* Ground plane - subtle color distinction */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#252538" />
      </mesh>

      {/* Ground grid - spacious feel */}
      <Grid
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#3d3d5c"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#5a5a7a"
        fadeDistance={50}
        fadeStrength={1.5}
        followCamera={false}
        infiniteGrid
      />

      {/* Render entities from SceneContext */}
      {entities.map((entity) => {
        const isSelected = entity.id === selectedEntityId

        if (entity.type === 'human') {
          return (
            <HumanFigure
              key={entity.id}
              figureType={entity.figureType}
              pose={entity.pose}
              position={entity.position}
              rotation={entity.rotation}
              label={entity.label}
              onClick={() => selectEntity(entity.id)}
              selected={isSelected}
            />
          )
        }

        if (entity.type === 'volume') {
          return (
            <GenericVolume
              key={entity.id}
              shape={entity.shape}
              dimensions={entity.dimensions}
              showBeak={entity.showBeak}
              label={entity.label}
              position={entity.position}
              facing={entity.facing}
              onClick={() => selectEntity(entity.id)}
              selected={isSelected}
            />
          )
        }

        return null
      })}
    </>
  )
}

// Scene Overview - full scene with orbit camera and frustum visualization
function SceneOverviewContent() {
  return (
    <>
      <SharedScene />
      <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
      <OrbitControls makeDefault target={[0, 1, 0]} />
      {/* Director camera frustum - only visible in Scene Overview */}
      <DirectorCameraFrustum />
    </>
  )
}

// Director's Frame - full scene with director camera
function DirectorFrameContent() {
  return (
    <>
      <SharedScene />
      <DirectorCameraView />
    </>
  )
}

export default function SceneCanvas() {
  const containerRef = useRef()
  const [directorFrameFocused, setDirectorFrameFocused] = useState(false)

  // Keyboard controls - only active when Director's Frame is focused
  useKeyboardControls(directorFrameFocused)

  // Handle clicks to manage focus
  const handleDirectorFrameClick = (e) => {
    e.stopPropagation()
    setDirectorFrameFocused(true)
  }

  const handleOverviewClick = () => {
    setDirectorFrameFocused(false)
  }

  const handleContainerClick = () => {
    setDirectorFrameFocused(false)
  }

  return (
    <div
      ref={containerRef}
      className="flex gap-4 w-full h-full relative"
      onClick={handleContainerClick}
    >
      {/* Scene Overview - Left viewport */}
      <div
        className="flex-1 border border-gray-700 rounded-lg overflow-hidden flex flex-col z-10"
        onClick={handleOverviewClick}
      >
        <div className="p-2 bg-gray-800 border-b border-gray-700 shrink-0">
          <h3 className="text-sm font-medium">Scene Overview</h3>
        </div>
        <View style={{ flex: 1, width: '100%' }}>
          <SceneOverviewContent />
        </View>
      </div>

      {/* Director's Frame - Right viewport */}
      <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden flex flex-col z-10">
        <div className="p-2 bg-gray-800 border-b border-gray-700 shrink-0 flex justify-between items-center">
          <h3 className="text-sm font-medium">Director's Frame</h3>
          {directorFrameFocused && (
            <span className="text-xs text-yellow-400">WASD to move</span>
          )}
        </div>
        <div
          className="flex-1 flex items-center justify-center bg-black cursor-pointer"
          onClick={handleDirectorFrameClick}
        >
          <View
            className={`w-full aspect-video max-h-full border-2 transition-colors ${
              directorFrameFocused
                ? 'border-yellow-400 shadow-lg shadow-yellow-400/20'
                : 'border-yellow-500/50'
            }`}
          >
            <DirectorFrameContent />
          </View>
        </div>
        {/* Help text */}
        <div className="p-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
          {directorFrameFocused ? (
            <span>
              <span className="text-yellow-400">WASD</span> move •{' '}
              <span className="text-yellow-400">Q/E</span> height •{' '}
              <span className="text-yellow-400">Arrows</span> angle •{' '}
              <span className="text-yellow-400">Alt</span> fine •{' '}
              Click outside to deselect
            </span>
          ) : (
            <span>Click to control camera</span>
          )}
        </div>
      </div>

      {/* Shared Canvas - renders all Views */}
      <Canvas
        eventSource={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 20
        }}
      >
        <View.Port />
        <RenderCapture />
      </Canvas>
    </div>
  )
}
