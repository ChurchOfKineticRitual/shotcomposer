// EntityManager.jsx - Add/remove/select entities
import { useEntities } from '../context/SceneContext'
import PoseControls from './entities/PoseControls'
import VolumeControls from './entities/VolumeControls'

function EntityItem({ entity, isSelected, onSelect, onRemove }) {
  const typeIcon = entity.type === 'human' ? '👤' : '📦'
  const typeBadge = entity.type === 'human' ? 'Human' : 'Volume'

  return (
    <div
      onClick={() => onSelect(entity.id)}
      className={`
        p-2 rounded cursor-pointer transition-colors
        ${isSelected
          ? 'bg-blue-600 border border-blue-400'
          : 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg">{typeIcon}</span>
          <div className="flex-1">
            <div className="text-sm font-medium">{entity.label}</div>
            <div className="text-xs text-gray-400">{typeBadge}</div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove(entity.id)
          }}
          className="text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-900/30 transition-colors"
          title="Remove entity"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default function EntityManager() {
  const {
    entities,
    selectedEntityId,
    selectedEntity,
    addEntity,
    removeEntity,
    selectEntity,
    updateEntity,
  } = useEntities()

  const handlePoseChange = (entityId, pose) => {
    updateEntity(entityId, { pose })
  }

  const handleVolumeChange = (entityId, updates) => {
    updateEntity(entityId, updates)
  }

  const handleAddHuman = () => {
    const humanCount = entities.filter(e => e.type === 'human').length
    addEntity({
      type: 'human',
      label: `Person ${humanCount + 1}`,
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      pose: {},
    })
  }

  const handleAddVolume = () => {
    const volumeCount = entities.filter(e => e.type === 'volume').length
    addEntity({
      type: 'volume',
      shape: 'box',
      dimensions: { width: 1, height: 1, depth: 1 },
      showBeak: true,
      label: `Object ${volumeCount + 1}`,
      position: [2, 0.5, 0],
      facing: 0,
    })
  }

  return (
    <div className="p-4 bg-gray-800 border-b border-gray-700">
      <h3 className="text-sm font-medium mb-3">Scene Entities</h3>

      {/* Add Entity Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleAddHuman}
          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
        >
          + Add Human
        </button>
        <button
          onClick={handleAddVolume}
          className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
        >
          + Add Volume
        </button>
      </div>

      {/* Entity List */}
      <div className="space-y-2">
        {entities.length === 0 ? (
          <div className="text-xs text-gray-400 text-center py-4">
            No entities yet. Add a human or volume to get started.
          </div>
        ) : (
          entities.map(entity => (
            <EntityItem
              key={entity.id}
              entity={entity}
              isSelected={selectedEntityId === entity.id}
              onSelect={selectEntity}
              onRemove={removeEntity}
            />
          ))
        )}
      </div>

      {/* Entity Count */}
      {entities.length > 0 && (
        <div className="text-xs text-gray-500 mt-3 text-center">
          {entities.length} {entities.length === 1 ? 'entity' : 'entities'}
        </div>
      )}

      {/* Pose Controls - Renders Leva UI for selected human entity */}
      <PoseControls entity={selectedEntity} onPoseChange={handlePoseChange} />

      {/* Volume Controls - Renders Leva UI for selected volume entity */}
      <VolumeControls entity={selectedEntity} onVolumeChange={handleVolumeChange} />
    </div>
  )
}
