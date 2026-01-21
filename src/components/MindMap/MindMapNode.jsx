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
<></>
  );
};