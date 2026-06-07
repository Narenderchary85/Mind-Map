import React from 'react';
import {
  FiMaximize2,
  FiRefreshCw,
  FiPlus,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiSave,
  FiFolderPlus
} from 'react-icons/fi';

export const MindMapToolbar = ({ 
  onFitView, 
  onResetView, 
  onAddNode,
  isDarkMode 
}) => {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          View Controls
        </h3>
        <div className="space-y-2">
          <button
            onClick={onFitView}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            <FiMaximize2 className="text-blue-500" />
            <span>Fit to View</span>
          </button>
          <button
            onClick={onResetView}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            <FiRefreshCw className="text-green-500" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          Node Operations
        </h3>
        <div className="space-y-2">
          <button
            onClick={onAddNode}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            <FiPlus className="text-purple-500" />
            <span>Add New Node</span>
          </button>
          <button
            onClick={() => onAddNode(null, 'topic')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            <FiFolderPlus className="text-purple-500" />
            <span>Add Topic Node</span>
          </button>
          <button
            onClick={() => console.log('Toggle connections')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            <FiEye className="text-yellow-500" />
            <span>Show/Hide Connections</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          Data Management
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => console.log('Save changes')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            <FiSave className="text-green-500" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className={`p-3 rounded-lg ${
        isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50'
      }`}>
        <h4 className="font-medium mb-2">How to Add Nodes:</h4>
        <ul className="text-sm space-y-1 opacity-80">
          <li>• Click "Add New Node" for root node</li>
          <li>• Select a node first to add child</li>
          <li>• Use + button on node for child</li>
          <li>• Drag between nodes to connect</li>
        </ul>
      </div>
    </div>
  );
};