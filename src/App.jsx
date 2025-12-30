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
    onCollapseExpand,
    onChangeNodeShape,
    onChangeNodeColor
  } = useMindMapStore();

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    initializeMindMap();
  }, [initializeMindMap]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ReactFlowProvider>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <header className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interactive MindMap</h1>
              <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Data-driven visualization from JSON
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Toolbar */}
            <div className={`w-64 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
              <MindMapToolbar 
                onFitView={onFitView}
                onResetView={onResetView}
                onAddNode={() => onAddNode()}
                onChangeNodeShape={onChangeNodeShape}
                onChangeNodeColor={onChangeNodeColor}
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
            <div className={`w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l`}>
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

          {/* Hover Info Panel */}
          {hoveredNode && !selectedNode && (
            <div className={`fixed bottom-4 right-4 max-w-sm p-4 rounded-lg shadow-lg z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="font-bold mb-2 text-gray-900 dark:text-white">{hoveredNode.data.label}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{hoveredNode.data.summary}</p>
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