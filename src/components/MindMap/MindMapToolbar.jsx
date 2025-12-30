import React from 'react';
import {
  FiMaximize2,
  FiRefreshCw,
  FiPlus,
  FiCircle,
  FiSquare,
  FiHexagon,
  FiDroplet,
  FiType
} from 'react-icons/fi';

export const MindMapToolbar = ({ 
  onFitView, 
  onResetView, 
  onAddNode,
  onChangeNodeShape,
  onChangeNodeColor,
  isDarkMode 
}) => {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6'  // Teal
  ];

  const shapes = [
    { id: 'circle', label: 'Circle', icon: FiCircle },
    { id: 'oval', label: 'Oval', icon: FiSquare },
    { id: 'rectangle', label: 'Rectangle', icon: FiSquare },
    { id: 'square', label: 'Square', icon: FiSquare },
    { id: 'diamond', label: 'Diamond', icon: FiHexagon }
  ];

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          View Controls
        </h3>
        <div className="space-y-2">
          <button
            onClick={onFitView}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-white' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <FiMaximize2 className="text-blue-500" />
            <span>Fit to View</span>
          </button>
          <button
            onClick={onResetView}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-white' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <FiRefreshCw className="text-green-500" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          Node Operations
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => onAddNode(null, 'topic', 'circle')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-white' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <FiPlus className="text-purple-500" />
            <span>Add Parent Node</span>
          </button>
          <button
            onClick={() => onAddNode(null, 'subtopic', 'oval')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-white' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <FiPlus className="text-green-500" />
            <span>Add Child Node</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
          <FiType className="text-blue-500" />
          Node Shapes
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {shapes.map((shape) => (
            <button
              key={shape.id}
              onClick={() => onChangeNodeShape && onChangeNodeShape(null, shape.id)}
              className={`p-2 rounded-lg flex flex-col items-center justify-center ${
                isDarkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'
              }`}
              title={`Set shape to ${shape.label}`}
            >
              <shape.icon className="text-gray-600 dark:text-gray-300" />
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">{shape.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
          <FiDroplet className="text-red-500" />
          Node Colors
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onChangeNodeColor && onChangeNodeColor(null, color)}
              className="w-8 h-8 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: color }}
              title={`Set color to ${color}`}
            />
          ))}
        </div>
      </div>

      <div className={`p-3 rounded-lg ${
        isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50'
      }`}>
        <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Quick Tips</h4>
        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
          <li>• Circles are parent nodes</li>
          <li>• Ovals are child nodes</li>
          <li>• Drag from handles to connect</li>
          <li>• Click node to select</li>
          <li>• Edit JSON directly in panel</li>
        </ul>
      </div>
    </div>
  );
};