import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { 
  FiChevronRight, 
  FiChevronDown, 
  FiEdit2, 
  FiPlus,
  FiTag,
  FiCircle,
  FiSquare,
  FiHexagon
} from 'react-icons/fi';

const ShapeComponent = ({ shape, color, size = 40 }) => {
  const styles = {
    circle: {
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: color
    },
    oval: {
      width: size * 1.5,
      height: size,
      borderRadius: '50%',
      backgroundColor: color
    },
    rectangle: {
      width: size * 1.5,
      height: size,
      borderRadius: '8px',
      backgroundColor: color
    },
    square: {
      width: size,
      height: size,
      borderRadius: '8px',
      backgroundColor: color
    },
    diamond: {
      width: size,
      height: size,
      backgroundColor: color,
      transform: 'rotate(45deg)',
      margin: 'auto'
    }
  };

  return <div style={styles[shape] || styles.circle} />;
};

export const ParentNode = ({ data, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  
  const handleLabelSubmit = () => {
    if (label.trim() !== '') {
      data.onUpdateNode?.(id, { label });
    }
    setIsEditing(false);
  };

  const handleAddChild = () => {
    data.onAddNode?.(id, 'child', 'oval');
  };

  return (
    <div className={`relative group ${selected ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 bg-blue-500 border-2 border-white"
      />
      
      <Handle
        type="target"
        position={Position.Right}
        className="w-4 h-4 bg-blue-500 border-2 border-white"
      />
      
      <Handle
        type="target"
        position={Position.Bottom}
        className="w-4 h-4 bg-blue-500 border-2 border-white"
      />
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-blue-500 border-2 border-white"
      />
      
      {/* Parent Node - Circle */}
      <div className="flex flex-col items-center justify-center">
        <div 
          className="rounded-full shadow-xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105"
          style={{ 
            backgroundColor: data.color || '#3B82F6',
            minWidth: '160px',
            minHeight: '160px'
          }}
        >
          <div className="text-center">
            {isEditing ? (
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={handleLabelSubmit}
                onKeyPress={(e) => e.key === 'Enter' && handleLabelSubmit()}
                className="w-full bg-white/90 px-3 py-2 rounded text-gray-900 font-bold text-center text-lg"
                autoFocus
              />
            ) : (
              <h3 
                className="font-bold text-xl text-white cursor-pointer mb-2"
                onClick={() => setIsEditing(true)}
                title="Click to edit"
              >
                {data.label}
              </h3>
            )}
            
            {data.summary && (
              <p className="text-sm text-white/90 line-clamp-2 mb-3">
                {data.summary}
              </p>
            )}
            
            <div className="flex justify-center gap-2">
              <button
                onClick={handleAddChild}
                className="text-xs bg-white/30 hover:bg-white/40 text-white px-3 py-1 rounded-full flex items-center gap-1"
                title="Add child node"
              >
                <FiPlus size={12} /> Add Child
              </button>
            </div>
          </div>
        </div>
        
        {/* Children count */}
        {(data.childrenCount || 0) > 0 && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {data.childrenCount} child nodes
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Top}
        className="w-4 h-4 bg-green-500 border-2 border-white"
      />
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 bg-green-500 border-2 border-white"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 bg-green-500 border-2 border-white"
      />
      
      <Handle
        type="source"
        position={Position.Left}
        className="w-4 h-4 bg-green-500 border-2 border-white"
      />
    </div>
  );
};

export const ChildNode = ({ data, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  
  const handleLabelSubmit = () => {
    if (label.trim() !== '') {
      data.onUpdateNode?.(id, { label });
    }
    setIsEditing(false);
  };

  const nodeStyles = {
    oval: 'rounded-full',
    rectangle: 'rounded-lg',
    square: 'rounded-lg',
    diamond: 'rotate-45'
  };

  const nodeShape = data.shape || 'oval';
  const nodeColor = data.color || '#10B981';

  return (
    <div className={`relative group ${selected ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      
      <div 
        className={`shadow-lg p-4 transition-all duration-300 hover:shadow-xl hover:scale-105 ${nodeStyles[nodeShape]}`}
        style={{ 
          backgroundColor: nodeColor,
          minWidth: '140px',
          minHeight: '80px'
        }}
      >
        <div className="text-center">
          {isEditing ? (
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleLabelSubmit}
              onKeyPress={(e) => e.key === 'Enter' && handleLabelSubmit()}
              className="w-full bg-white/90 px-2 py-1 rounded text-gray-900 font-bold text-center"
              autoFocus
            />
          ) : (
            <h4 
              className="font-bold text-white cursor-pointer"
              onClick={() => setIsEditing(true)}
              title="Click to edit"
            >
              {data.label}
            </h4>
          )}
          
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mt-2">
              {data.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </div>
  );
};