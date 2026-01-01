import React from 'react';

const ContextMenu = ({ show, x, y, nodeId, isBackground, onAction, onClose }) => {
  if (!show) return null;

  const handleAction = (action) => {
    onAction(action);
  };

  const menuItems = isBackground 
    ? [
        { label: 'Add Node', icon: '➕', action: 'add-node' },
      ]
    : [
        { label: 'Connect to...', icon: '🔗', action: 'connect' },
        { label: 'Rename', icon: '✏️', action: 'rename' },
        { label: 'Edit Description', icon: '📝', action: 'edit-desc' },
        { label: 'Remove Connection', icon: '✂️', action: 'remove-edge' },
        { label: 'Remove Node', icon: '🗑️', action: 'remove-node', danger: true },
      ];

  return (
    <>
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div 
        className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        style={{ left: x, top: y }}
      >
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleAction(item.action)}
            className={`w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 ${
              item.danger ? 'text-red-500 hover:text-red-600' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <span>{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default ContextMenu;