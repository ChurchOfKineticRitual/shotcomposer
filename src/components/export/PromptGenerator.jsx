// PromptGenerator.jsx - Auto-generate cinematographic prompts
import { useState, useEffect } from 'react';
import { useDirectorCamera, useEntities } from '../../context/SceneContext';
import { generatePrompt } from '../../utils/cinematography';

export default function PromptGenerator() {
  const { camera } = useDirectorCamera();
  const { entities } = useEntities();
  const [promptData, setPromptData] = useState(null);
  const [copied, setCopied] = useState(false);

  // Generate prompt whenever camera or entities change
  useEffect(() => {
    const data = generatePrompt(camera, entities);
    setPromptData(data);
  }, [camera, entities]);

  const handleCopy = async () => {
    if (!promptData?.full) return;

    try {
      await navigator.clipboard.writeText(promptData.full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!promptData) return null;

  return (
    <div className="p-4 bg-gray-800 border-t border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-medium text-gray-300 uppercase tracking-wide">
          Generated Prompt
        </h4>
        <button
          onClick={handleCopy}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>

      {/* Shot metadata badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-900/50 text-blue-300 rounded border border-blue-700">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          {promptData.shotType}
        </span>

        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-900/50 text-purple-300 rounded border border-purple-700">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
          {promptData.angle}
        </span>

        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-amber-900/50 text-amber-300 rounded border border-amber-700">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          {promptData.focalLength}mm
        </span>

        {entities.length > 0 && (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-900/50 text-green-300 rounded border border-green-700">
            <svg
              className="w-3 h-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {entities.length} {entities.length === 1 ? 'entity' : 'entities'}
          </span>
        )}
      </div>

      {/* Full prompt text */}
      <textarea
        readOnly
        value={promptData.full}
        className="w-full h-32 p-3 text-sm text-gray-200 bg-gray-900 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono leading-relaxed"
        onClick={(e) => e.target.select()}
      />

      {/* Entity descriptions list */}
      {promptData.entities.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            Entities in Frame
          </h5>
          <ul className="space-y-1">
            {promptData.entities.map((desc, idx) => (
              <li
                key={idx}
                className="text-xs text-gray-400 pl-4 border-l-2 border-gray-700"
              >
                {desc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Usage hint */}
      <div className="mt-3 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500 italic">
          Optimized for NanoBanana/Gemini 2.5 Flash Image. Adjust camera and
          entities to refine the prompt.
        </p>
      </div>
    </div>
  );
}
