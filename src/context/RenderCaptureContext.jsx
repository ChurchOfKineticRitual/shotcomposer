// RenderCaptureContext.jsx - Bridge between Canvas and RenderExport UI
import { createContext, useContext, useState, useCallback } from 'react'

const RenderCaptureContext = createContext()

export function RenderCaptureProvider({ children }) {
  const [captureFunction, setCaptureFunction] = useState(null)
  const [isReady, setIsReady] = useState(false)

  // Called by RenderCapture component inside Canvas to register the capture function
  const registerCaptureFunction = useCallback((fn) => {
    setCaptureFunction(() => fn)
    setIsReady(true)
  }, [])

  // Called by RenderExport UI to trigger a capture
  const captureFrame = useCallback(
    async (width, height) => {
      if (!captureFunction) {
        throw new Error('Capture function not ready')
      }
      return captureFunction(width, height)
    },
    [captureFunction]
  )

  return (
    <RenderCaptureContext.Provider
      value={{ captureFrame, registerCaptureFunction, isReady }}
    >
      {children}
    </RenderCaptureContext.Provider>
  )
}

export function useRenderCapture() {
  const context = useContext(RenderCaptureContext)
  if (!context) {
    throw new Error('useRenderCapture must be used within a RenderCaptureProvider')
  }
  return context
}
