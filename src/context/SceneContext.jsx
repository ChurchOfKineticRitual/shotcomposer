// SceneContext.jsx - Global state management for scene entities and camera
import { createContext, useContext, useReducer } from 'react'

const initialState = {
  entities: [],
  selectedEntityId: null,
  directorCamera: {
    position: [0, 1.6, 5],
    rotation: [0, 0, 0],
    fov: 50,
  },
}

function sceneReducer(state, action) {
  switch (action.type) {
    case 'ADD_ENTITY':
      return {
        ...state,
        entities: [...state.entities, { id: Date.now(), ...action.payload }],
      }
    case 'UPDATE_ENTITY':
      return {
        ...state,
        entities: state.entities.map(e =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      }
    case 'REMOVE_ENTITY':
      return {
        ...state,
        entities: state.entities.filter(e => e.id !== action.payload),
        selectedEntityId: state.selectedEntityId === action.payload ? null : state.selectedEntityId,
      }
    case 'SELECT_ENTITY':
      return { ...state, selectedEntityId: action.payload }
    case 'UPDATE_CAMERA':
      return {
        ...state,
        directorCamera: { ...state.directorCamera, ...action.payload },
      }
    default:
      return state
  }
}

const SceneContext = createContext()

export function SceneProvider({ children }) {
  const [state, dispatch] = useReducer(sceneReducer, initialState)
  return (
    <SceneContext.Provider value={{ state, dispatch }}>
      {children}
    </SceneContext.Provider>
  )
}

export function useScene() {
  const context = useContext(SceneContext)
  if (!context) {
    throw new Error('useScene must be used within a SceneProvider')
  }
  return context
}

// Convenience hooks for common operations
export function useDirectorCamera() {
  const { state, dispatch } = useScene()

  const updateCamera = (updates) => {
    dispatch({ type: 'UPDATE_CAMERA', payload: updates })
  }

  return {
    camera: state.directorCamera,
    updateCamera,
    setPosition: (position) => updateCamera({ position }),
    setRotation: (rotation) => updateCamera({ rotation }),
    setFov: (fov) => updateCamera({ fov }),
  }
}

export function useEntities() {
  const { state, dispatch } = useScene()

  return {
    entities: state.entities,
    selectedEntityId: state.selectedEntityId,
    selectedEntity: state.entities.find(e => e.id === state.selectedEntityId),
    addEntity: (entity) => dispatch({ type: 'ADD_ENTITY', payload: entity }),
    updateEntity: (id, updates) => dispatch({ type: 'UPDATE_ENTITY', payload: { id, ...updates } }),
    removeEntity: (id) => dispatch({ type: 'REMOVE_ENTITY', payload: id }),
    selectEntity: (id) => dispatch({ type: 'SELECT_ENTITY', payload: id }),
  }
}
