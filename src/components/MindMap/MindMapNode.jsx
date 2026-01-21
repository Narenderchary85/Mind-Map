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
      
      {(data.connectionCount || 0) > 0 && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {data.connectionCount}
        </div>
      )}
    </div>
  );
};