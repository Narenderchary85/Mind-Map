import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  FiChevronRight, 
  FiChevronDown, 
  FiEdit2, 
  FiPlus,
  FiLink,
  FiTag
} from 'react-icons/fi';

export const MindMapNode = ({ data, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  
  const handleLabelSubmit = () => {
    if (label.trim() !== '') {
      data.onUpdateNode?.(id, { label });
    }
    setIsEditing(false);
  };

  const handleAddChild = () => {
    data.onAddNode?.(id, 'subtopic');
  };

  const handleCollapseExpand = () => {
    data.onCollapseExpand?.(id);
  };

  const nodeColors = {
    default: 'from-blue-500 to-blue-600',
    topic: 'from-purple-500 to-purple-600',
    subtopic: 'from-green-500 to-green-600',
    detail: 'from-yellow-500 to-yellow-600',
    reference: 'from-gray-500 to-gray-600'
  };

  const bgColor = nodeColors[data.type] || nodeColors.default;

  return (
    <div className={`relative group ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      {/* Input handles for multiple connections */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      
      {/* Node content */}
      <div className={`relative rounded-lg shadow-lg p-4 min-w-[200px] transition-all duration-200 hover:shadow-xl ${
        data.isExpanded ? 'bg-gradient-to-br' : 'bg-gradient-to-br from-gray-200 to-gray-300'
      } ${data.isExpanded ? bgColor : 'from-gray-200 to-gray-300'} ${selected ? 'scale-105' : ''}`}>
        
        {/* Node header */}
        <div className="flex items-center justify-between mb-2">
          {isEditing ? (
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleLabelSubmit}
              onKeyPress={(e) => e.key === 'Enter' && handleLabelSubmit()}
              className="flex-1 bg-white/90 px-2 py-1 rounded text-gray-900 font-bold"
              autoFocus
            />
          ) : (
            <h3 
              className="font-bold text-lg text-white cursor-pointer"
              onClick={() => setIsEditing(true)}
              title="Click to edit"
            >
              {data.label}
              {(data.childrenCount || 0) > 0 && (
                <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded">
                  {data.childrenCount}
                </span>
              )}
            </h3>
          )}
          
          {/* Expand/Collapse button */}
          {(data.childrenCount || 0) > 0 && (
            <button
              onClick={handleCollapseExpand}
              className="text-white hover:bg-white/20 p-1 rounded"
              title={data.isExpanded ? 'Collapse' : 'Expand'}
            >
              {data.isExpanded ? <FiChevronDown /> : <FiChevronRight />}
            </button>
          )}
        </div>
        
        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {data.tags.map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-white/20 text-white flex items-center gap-1"
              >
                <FiTag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Summary (visible on node) */}
        {data.summary && (
          <p className="text-sm text-white/90 mb-3 line-clamp-2">
            {data.summary}
          </p>
        )}
        
        {/* Quick actions */}
        <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleAddChild}
            className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded flex items-center gap-1"
            title="Add child node"
          >
            <FiPlus size={12} /> Add Child
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded flex items-center gap-1"
            title="Edit node"
          >
            <FiEdit2 size={12} /> Edit
          </button>
        </div>
      </div>
      
      {/* Output handles for multiple connections */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
      
      {/* Connection indicators */}
      {(data.connectionCount || 0) > 0 && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {data.connectionCount}
        </div>
      )}
    </div>
  );
};