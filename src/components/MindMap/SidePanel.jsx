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
     
    </div>
  );
};