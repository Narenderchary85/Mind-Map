import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { MindMapView } from './components/MindMap/MindMapView';
import { MindMapToolbar } from './components/MindMap/MindMapToolbar';
import { SidePanel } from './components/MindMap/SidePanel';
import { ThemeToggle } from './components/ThemeToggle';
import { useMindMapStore } from './hooks/useMindMap';
import 'reactflow/dist/style.css';

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
    onUpdateNode,
    onAddNode,
    onDeleteNode,
    onCollapseExpand
  } = useMindMapStore();

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize mindmap on component mount
  useEffect(() => {
    initializeMindMap();
  }, [initializeMindMap]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <ReactFlowProvider>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <header className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Interactive MindMap</h1>
              <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </div>
            <div className="text-sm text-gray-500">
              Data-driven visualization from JSON
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Toolbar */}
            <div className={`w-64 border-r ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <MindMapToolbar 
                onFitView={onFitView}
                onResetView={onResetView}
                onAddNode={() => onAddNode()} // Add node without parent - will use selected or create root
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
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Right Sidebar - Node Details */}
            <div className={`w-80 border-l ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <SidePanel
                node={selectedNode}
                hoveredNode={hoveredNode}
                onUpdateNode={onUpdateNode}
                onDeleteNode={onDeleteNode}
                onCollapseExpand={onCollapseExpand}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          {/* Hover Info Panel (Floating) */}
          {hoveredNode && !selectedNode && (
            <div className={`fixed bottom-4 right-4 max-w-sm p-4 rounded-lg shadow-lg z-50 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <h3 className="font-bold mb-2">{hoveredNode.data.label}</h3>
              <p className="text-sm opacity-80">{hoveredNode.data.summary}</p>
              <div className="mt-2 flex gap-2">
                {hoveredNode.data.tags?.map((tag, index) => (
                  <span 
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'}`}
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