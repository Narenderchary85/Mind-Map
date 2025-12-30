import React, { useState, useEffect } from 'react';
import {
  FiEdit2,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiX,
  FiTag,
  FiCalendar,
  FiType,
  FiDroplet
} from 'react-icons/fi';

export const SidePanel = ({ 
  node, 
  hoveredNode,
  onUpdateNode,
  onDeleteNode,
  onCollapseExpand,
  onChangeNodeShape,
  onChangeNodeColor,
  isDarkMode 
}) => {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newTag, setNewTag] = useState('');
  const [jsonData, setJsonData] = useState('');
  const [isJsonValid, setIsJsonValid] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    metadata: true,
    json: false
  });

  const displayNode = node || hoveredNode;

  useEffect(() => {
    if (displayNode) {
      setJsonData(JSON.stringify(displayNode, null, 2));
      setIsJsonValid(true);
    }
  }, [displayNode]);

  if (!displayNode) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <FiType size={24} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No Node Selected</h3>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Click on any node to view and edit its details.
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

  const handleJsonChange = (e) => {
    const newJson = e.target.value;
    setJsonData(newJson);
    
    try {
      JSON.parse(newJson);
      setIsJsonValid(true);
    } catch (error) {
      setIsJsonValid(false);
    }
  };

  const applyJsonChanges = () => {
    try {
      const parsedData = JSON.parse(jsonData);
      // Update the node with new data
      console.log('Applying JSON changes:', parsedData);
      // Note: You would need to implement a proper update function in your store
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonData);
  };

  const colors = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B',
    '#EF4444', '#EC4899', '#6366F1', '#14B8A6'
  ];

  const shapes = ['circle', 'oval', 'rectangle', 'square', 'diamond'];

  return (
    <div className="h-full overflow-y-auto">
      {/* Node Header */}
      <div className={`p-6 border-b ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{displayNode.data.label}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {displayNode.data.type || 'node'}
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
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={displayNode.data.isExpanded ? 'Collapse' : 'Expand'}
            >
              {displayNode.data.isExpanded ? '−' : '+'}
            </button>
            <button
              onClick={() => onDeleteNode(displayNode.id)}
              className="p-2 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete node"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <FiEdit2 /> Summary
            </h3>
            {editingField !== 'summary' && (
              <button
                onClick={() => handleStartEdit('summary', displayNode.data.summary || '')}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
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
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingField(null)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              {displayNode.data.summary || 'No summary provided.'}
            </p>
          )}
        </div>

        {/* Node Appearance */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
            <FiType /> Appearance
          </h3>
          
          <div className="space-y-4">
            {/* Shape Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Shape</label>
              <div className="flex gap-2">
                {shapes.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => onChangeNodeShape(displayNode.id, shape)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      displayNode.data.shape === shape
                        ? 'bg-blue-500 text-white'
                        : isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Color</label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onChangeNodeColor(displayNode.id, color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      displayNode.data.color === color 
                        ? 'border-blue-500' 
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    title={`Set color to ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <FiTag /> Tags
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {displayNode.data.tags?.map((tag, index) => (
              <span 
                key={index}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="opacity-70 hover:opacity-100"
                >
                  ×
                </button>
              </span>
            ))}
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
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <button
              onClick={handleAddTag}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add
            </button>
          </div>
        </div>

        {/* JSON Editor Section */}
        <div>
          <div 
            className="flex items-center justify-between mb-3 cursor-pointer"
            onClick={() => toggleSection('json')}
          >
            <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <FiCopy /> JSON Editor
            </h3>
            <div className="flex items-center gap-2">
              {!isJsonValid && (
                <span className="text-xs text-red-500">Invalid JSON</span>
              )}
              {expandedSections.json ? '−' : '+'}
            </div>
          </div>
          
          {expandedSections.json && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Edit JSON directly:
                </span>
                <button
                  onClick={copyToClipboard}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  <FiCopy className="inline mr-1" /> Copy
                </button>
              </div>
              
              <div className="relative">
                <textarea
                  value={jsonData}
                  onChange={handleJsonChange}
                  className={`w-full h-64 font-mono text-sm p-3 rounded border ${
                    isDarkMode 
                      ? 'bg-gray-900 border-gray-700 text-gray-300' 
                      : 'bg-gray-50 border-gray-300 text-gray-800'
                  } ${!isJsonValid ? 'border-red-500' : ''}`}
                  spellCheck="false"
                />
                {!isJsonValid && (
                  <div className="absolute top-2 right-2 text-red-500 text-xs">
                    Invalid JSON
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={applyJsonChanges}
                  disabled={!isJsonValid}
                  className={`px-3 py-2 rounded text-sm font-medium ${
                    isJsonValid
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FiCheck className="inline mr-1" /> Apply Changes
                </button>
                <button
                  onClick={() => setJsonData(JSON.stringify(displayNode, null, 2))}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300"
                >
                  <FiX className="inline mr-1" /> Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Metadata Section */}
        <div>
          <div 
            className="flex items-center justify-between mb-3 cursor-pointer"
            onClick={() => toggleSection('metadata')}
          >
            <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <FiCalendar /> Metadata
            </h3>
            {expandedSections.metadata ? '−' : '+'}
          </div>
          
          {expandedSections.metadata && (
            <div className={`space-y-2 p-3 rounded ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                <span className="text-gray-900 dark:text-white">{displayNode.data.createdAt || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                <span className="text-gray-900 dark:text-white">{displayNode.data.updatedAt || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Position:</span>
                <span className="text-gray-900 dark:text-white">
                  ({Math.round(displayNode.position.x)}, {Math.round(displayNode.position.y)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Children:</span>
                <span className="text-gray-900 dark:text-white">{displayNode.data.childrenCount || 0}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};