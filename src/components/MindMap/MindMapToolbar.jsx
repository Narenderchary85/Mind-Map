import React from 'react';
import {
  FiMaximize2,
  FiRefreshCw,
  FiPlus,
  FiChevronDown,
  FiChevronUp,
  FiFolderPlus,
  FiFolderMinus,
  FiDownload,
  FiGrid
} from 'react-icons/fi';

export const MindMapToolbar = ({ 
  onFitView, 
  onResetView, 
  onExpandAll,
  onCollapseAll,
  onDrillDown,
  onDrillUp,
  onAddNode,
  isDarkMode 
}) => {
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
          Hierarchy Controls
        </h3>
        <div className="space-y-2">
          <button
            onClick={onExpandAll}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-white' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <FiFolderPlus className="text-purple-500" />
            <span>Expand All</span>
          </button>
          <button
            onClick={onCollapseAll}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-white' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <FiFolderMinus className="text-purple-500" />
            <span>Collapse All</span>
          </button>
          <button
            onClick={onDrillDown}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-white' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <FiChevronDown className="text-green-500" />
            <span>Drill Down</span>
          </button>
          <button
            onClick={onDrillUp}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-white' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <FiChevronUp className="text-green-500" />
            <span>Drill Up</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Node Operations
        </h3>
        <div className="space-y-2">
          <button
            onClick={onAddNode}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-white' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <FiPlus className="text-green-500" />
            <span>Add New Node</span>
          </button>
        </div>
      </div>

      <div className={`p-3 rounded-lg ${
        isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50'
      }`}>
        <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Tips</h4>
        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
          <li>• Right-click nodes for more options</li>
          <li>• Drag from handles to connect</li>
          <li>• Click node text to edit</li>
          <li>• Use Drill Up/Down for hierarchy</li>
        </ul>
      </div>
    </div>
  );
};