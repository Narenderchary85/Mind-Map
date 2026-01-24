import React, { useState } from 'react';
import {
  FiEdit2,
  FiTrash2,
  FiLink,
  FiChevronDown,
  FiChevronUp,
  FiCopy,
  FiTag,
  FiCalendar,
  FiUser
} from 'react-icons/fi';

export const SidePanel = ({ 
  node, 
  hoveredNode,
  onUpdateNode,
  onDeleteNode,
  onCollapseExpand,
  isDarkMode 
}) => {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newTag, setNewTag] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    metadata: true,
    connections: true
  });

  const displayNode = node || hoveredNode;

  if (!displayNode) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <FiLink size={24} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
        </div>
        <h3 className="text-lg font-medium mb-2">No Node Selected</h3>
        <p className="text-center opacity-70">
          Click on any node to view and edit its details here.
          <br />
          Hover over nodes for quick information.
        </p>
      </div>
    );
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleStartEdit = (field, value) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleSaveEdit = () => {
    if (editValue.trim() !== '' && editingField) {
      onUpdateNode(displayNode.id, { [editingField]: editValue });
    }
    setEditingField(null);
    setEditValue('');
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      const currentTags = displayNode.data.tags || [];
      onUpdateNode(displayNode.id, { 
        tags: [...currentTags, newTag.trim()] 
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentTags = displayNode.data.tags || [];
    onUpdateNode(displayNode.id, { 
      tags: currentTags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className={`p-6 border-b ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">{displayNode.data.label}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {displayNode.data.type}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                displayNode.data.isExpanded 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {displayNode.data.isExpanded ? 'Expanded' : 'Collapsed'}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onCollapseExpand(displayNode.id)}
              className={`p-2 rounded ${
                isDarkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'
              }`}
              title={displayNode.data.isExpanded ? 'Collapse' : 'Expand'}
            >
              {displayNode.data.isExpanded ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            <button
              onClick={() => onDeleteNode(displayNode.id)}
              className={`p-2 rounded text-red-500 hover:bg-red-50`}
              title="Delete node"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FiEdit2 /> Summary
            </h3>
            {editingField !== 'summary' && (
              <button
                onClick={() => handleStartEdit('summary', displayNode.data.summary || '')}
                className="text-sm opacity-70 hover:opacity-100"
              >
                Edit
              </button>
            )}
          </div>
          
          {editingField === 'summary' ? (
            <div className="space-y-2">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className={`w-full p-2 rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                }`}
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingField(null)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              {displayNode.data.summary || 'No summary provided.'}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FiTag /> Tags
            </h3>
          </div>
          

        
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add new tag"
              className={`flex-1 px-3 py-1 rounded border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-white border-gray-300'
              }`}
            />
            <button
              onClick={handleAddTag}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Add
            </button>
          </div>
        </div>
        <div>
          <div 
            className="flex items-center justify-between mb-3 cursor-pointer"
            onClick={() => toggleSection('metadata')}
          >
            <h3 className="font-semibold flex items-center gap-2">
              <FiCalendar /> Metadata
            </h3>
            {expandedSections.metadata ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          
          {expandedSections.metadata && (
            <div className={`space-y-2 p-3 rounded ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="flex justify-between">
                <span className="opacity-70">Created:</span>
                <span>{displayNode.data.createdAt || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Updated:</span>
                <span>{displayNode.data.updatedAt || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Position:</span>
                <span>
                  ({Math.round(displayNode.position.x)}, {Math.round(displayNode.position.y)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Connections:</span>
                <span>{displayNode.data.connectionCount || 0}</span>
              </div>
            </div>
          )}
        </div>
        <div>
          <div 
            className="flex items-center justify-between mb-3 cursor-pointer"
            onClick={() => toggleSection('details')}
          >
            <h3 className="font-semibold flex items-center gap-2">
              <FiCopy /> JSON Data
            </h3>
            {expandedSections.details ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          
          {expandedSections.details && (
            <pre className={`text-xs p-3 rounded overflow-x-auto ${
              isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
            }`}>
              {JSON.stringify(displayNode, null, 2)}
            </pre>
          )}
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateNode(displayNode.id, { priority: 'high' })}
              className={`p-2 rounded flex flex-col items-center justify-center ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span className="text-red-500">★</span>
              <span className="text-xs mt-1">Mark Important</span>
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(displayNode))}
              className={`p-2 rounded flex flex-col items-center justify-center ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <FiCopy />
              <span className="text-xs mt-1">Copy JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};