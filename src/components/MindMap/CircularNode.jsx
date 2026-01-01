import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { FiEdit2, FiPlus, FiChevronDown, FiChevronRight } from 'react-icons/fi';

const CircularNode = ({ data, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  
  const handleLabelSubmit = () => {
    if (label.trim() !== '') {
      data.onUpdateNode?.(id, { label });
    }
    setIsEditing(false);
  };

  const handleAddChild = () => {
    data.onAddNode?.(id, 'child');
  };

  const handleCollapseExpand = () => {
    data.onCollapseExpand?.(id);
  };

  // Determine node size and style based on level
  const getNodeStyle = () => {
    const level = data.level || 0;
    
    // Size based on level
    const sizes = [120, 100, 80, 60, 50];
    const size = sizes[Math.min(level, sizes.length - 1)];
    
    // Colors based on level
    const colors = [
      '#3B82F6', // Level 0 - Root - Blue
      '#10B981', // Level 1 - Category - Green
      '#8B5CF6', // Level 2 - Subcategory - Purple
      '#F59E0B', // Level 3 - Detail - Orange
      '#EF4444'  // Level 4+ - Leaf - Red
    ];
    const color = colors[Math.min(level, colors.length - 1)];
    
    // Font size based on level
    const fontSizes = ['16px', '14px', '12px', '11px', '10px'];
    const fontSize = fontSizes[Math.min(level, fontSizes.length - 1)];
    
    return {
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: '50%',
      fontSize: fontSize,
      border: selected ? '3px solid #FFC107' : '2px solid white',
      boxShadow: selected 
        ? '0 0 0 3px rgba(255, 193, 7, 0.3), 0 8px 25px rgba(0, 0, 0, 0.2)'
        : '0 4px 12px rgba(0, 0, 0, 0.15)'
    };
  };

  const nodeStyle = getNodeStyle();
  const isParent = (data.childrenCount || 0) > 0;

  return (
    <div className="relative group">
      {/* Multiple connection points around the circle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-white border-2 border-blue-500"
        style={{ top: '0%', left: '50%', transform: 'translateX(-50%)' }}
      />
      <Handle
        type="target"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-blue-500"
        style={{ top: '50%', right: '0%', transform: 'translateY(-50%)' }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        className="w-3 h-3 bg-white border-2 border-blue-500"
        style={{ bottom: '0%', left: '50%', transform: 'translateX(-50%)' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-blue-500"
        style={{ top: '50%', left: '0%', transform: 'translateY(-50%)' }}
      />
      
      {/* Node Content */}
      <div 
        className="flex flex-col items-center justify-center text-white font-semibold text-center transition-all duration-300 hover:scale-105"
        style={nodeStyle}
      >
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleLabelSubmit}
            onKeyPress={(e) => e.key === 'Enter' && handleLabelSubmit()}
            className="w-4/5 bg-white/20 text-white text-center rounded px-2 py-1"
            style={{ fontSize: nodeStyle.fontSize }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <div className="font-bold mb-1">{data.label}</div>
            {data.summary && (
              <div className="text-xs opacity-80 line-clamp-2">
                {data.summary}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Children count badge */}
      {isParent && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
          {data.childrenCount}
        </div>
      )}
      
      {/* Action buttons - appear on hover */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleAddChild}
          className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full shadow-md"
          title="Add child node"
        >
          <FiPlus size={12} />
        </button>
        {isParent && (
          <button
            onClick={handleCollapseExpand}
            className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-full shadow-md"
            title={data.isExpanded ? 'Collapse' : 'Expand'}
          >
            {data.isExpanded ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
          </button>
        )}
      </div>
      
      {/* Output handles */}
      <Handle
        type="source"
        position={Position.Top}
        className="w-3 h-3 bg-white border-2 border-green-500"
        style={{ top: '0%', left: '50%', transform: 'translateX(-50%)' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-green-500"
        style={{ top: '50%', right: '0%', transform: 'translateY(-50%)' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-white border-2 border-green-500"
        style={{ bottom: '0%', left: '50%', transform: 'translateX(-50%)' }}
      />
      <Handle
        type="source"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-green-500"
        style={{ top: '50%', left: '0%', transform: 'translateY(-50%)' }}
      />
    </div>
  );
};

export default CircularNode;