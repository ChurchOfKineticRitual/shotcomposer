import SceneCanvas from './components/SceneCanvas'
import CameraUI from './components/CameraUI'
import EntityManager from './components/EntityManager'
import RenderExport from './components/export/RenderExport'
import PromptGenerator from './components/export/PromptGenerator'
import { SceneProvider } from './context/SceneContext'
import { RenderCaptureProvider } from './context/RenderCaptureContext'

function App() {
  return (
    <SceneProvider>
    <RenderCaptureProvider>
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col">
      <header className="p-4 border-b border-gray-700 z-10 relative bg-gray-900">
        <h1 className="text-2xl font-bold">ShotComposer</h1>
        <p className="text-gray-400 text-sm">3D Camera Sandbox for AI Image Generation</p>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Controls */}
        <div className="w-80 border-r border-gray-700 flex flex-col overflow-y-auto z-10 bg-gray-900">
          <CameraUI />
          <EntityManager />
          <div className="flex-1" />
          <PromptGenerator />
          <RenderExport />
        </div>

        {/* Main canvas area */}
        <main className="flex-1 p-4 relative">
          <SceneCanvas />
        </main>
      </div>
    </div>
    </RenderCaptureProvider>
    </SceneProvider>
  )
}

export default App
