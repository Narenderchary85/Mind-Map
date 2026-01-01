import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { MindMapView } from './components/MindMap/MindMapView';
import { MindMapToolbar } from './components/MindMap/MindMapToolbar';
import { SidePanel } from './components/MindMap/SidePanel';
import { ThemeToggle } from './components/ThemeToggle';
import { useMindMapStore } from './hooks/useMindMap';
import mindmapData from './data/mindmapData.json';
import 'reactflow/dist/style.css';
import ContextMenu from './components/MindMap/ContextMenu';

function App() {
  const { 
    nodes, 
    edges, 
    selectedNode,
    hoveredNode,
    initializeMindMap,
    onNodeClick,
    onNodeMouseEnter,
    onNodeMouseLeave,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onFitView,
    onResetView,
    onExpandAll,
    onCollapseAll,
    onDrillDown,
    onDrillUp,
    onUpdateNode,
    onAddNode,
    onDeleteNode,
    onCollapseExpand,
    onChangeNodeShape,
    onChangeNodeColor,
    onAddEdge,
    onRemoveEdge,
    onRemoveNode
  } = useMindMapStore();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    nodeId: null,
    isBackground: false
  });

  useEffect(() => {
    initializeMindMap();
  }, [initializeMindMap]);

  // Handle context menu
  const handleContextMenu = (e, nodeId = null, isBackground = false) => {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      nodeId,
      isBackground
    });
  };

  const handleContextMenuAction = (action) => {
    switch (action) {
      case 'add-node':
        onAddNode(contextMenu.nodeId);
        break;
      case 'connect':
        // Start connection mode
        console.log('Start connection mode for node:', contextMenu.nodeId);
        break;
      case 'rename':
        if (contextMenu.nodeId) {
          const label = prompt('Enter new node name:');
          if (label) onUpdateNode(contextMenu.nodeId, { label });
        }
        break;
      case 'edit-desc':
        if (contextMenu.nodeId) {
          const summary = prompt('Edit description:');
          if (summary) onUpdateNode(contextMenu.nodeId, { summary });
        }
        break;
      case 'remove-edge':
        if (contextMenu.nodeId) {
          // You'd need to implement edge removal logic
          console.log('Remove edge for node:', contextMenu.nodeId);
        }
        break;
      case 'remove-node':
        if (contextMenu.nodeId) {
          onRemoveNode(contextMenu.nodeId);
        }
        break;
    }
    setContextMenu({ show: false, x: 0, y: 0, nodeId: null, isBackground: false });
  };

  // Handle background context menu
  const handleBackgroundContextMenu = (e) => {
    handleContextMenu(e, null, true);
  };

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      onContextMenu={handleBackgroundContextMenu}
      onClick={() => contextMenu.show && setContextMenu({ show: false, x: 0, y: 0, nodeId: null, isBackground: false })}
    >
      <ReactFlowProvider>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <header className={`flex items-center justify-between p-4 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border-b`}>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Interactive MindMap - Vitamins in Human Body
              </h1>
              <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Hierarchical visualization with circular layout
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Toolbar */}
            <div className={`w-64 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border-r`}>
              <MindMapToolbar 
                onFitView={onFitView}
                onResetView={onResetView}
                onExpandAll={onExpandAll}
                onCollapseAll={onCollapseAll}
                onDrillDown={onDrillDown}
                onDrillUp={onDrillUp}
                onAddNode={() => onAddNode()}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Main MindMap Area */}
            <div className="flex-1 relative">
              <MindMapView
                nodes={nodes}
                edges={edges}
                onNodeClick={onNodeClick}
                onNodeMouseEnter={onNodeMouseEnter}
                onNodeMouseLeave={onNodeMouseLeave}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeContextMenu={(e, node) => handleContextMenu(e, node.id, false)}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Right Sidebar - Node Details */}
            <div className={`w-80 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border-l`}>
              <SidePanel
                node={selectedNode}
                hoveredNode={hoveredNode}
                onUpdateNode={onUpdateNode}
                onDeleteNode={onDeleteNode}
                onCollapseExpand={onCollapseExpand}
                onChangeNodeShape={onChangeNodeShape}
                onChangeNodeColor={onChangeNodeColor}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          {/* Context Menu */}
          <ContextMenu
            show={contextMenu.show}
            x={contextMenu.x}
            y={contextMenu.y}
            nodeId={contextMenu.nodeId}
            isBackground={contextMenu.isBackground}
            onAction={handleContextMenuAction}
            onClose={() => setContextMenu({ show: false, x: 0, y: 0, nodeId: null, isBackground: false })}
          />

          {/* Hover Info Panel */}
          {hoveredNode && !selectedNode && (
            <div className={`fixed bottom-4 right-4 max-w-sm p-4 rounded-lg shadow-lg z-50 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className="font-bold mb-2 text-gray-900 dark:text-white">{hoveredNode.data.label}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{hoveredNode.data.summary}</p>
              <div className="mt-2 flex gap-2">
                {hoveredNode.data.tags?.map((tag, index) => (
                  <span 
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default App;