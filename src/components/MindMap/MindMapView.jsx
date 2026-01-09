import React, { useRef, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  MiniMap,
  Panel
} from 'reactflow';
import { MindMapNode } from './MindMapNode';
import { useReactFlow } from 'reactflow';
import { FiMaximize2, FiRefreshCw, FiDownload, FiUpload } from 'react-icons/fi';

const nodeTypes = {
  mindmapNode: MindMapNode,
};

export const MindMapView = ({
  nodes,
  edges,
  onNodeClick,
  onNodeMouseEnter,
  onNodeMouseLeave,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isDarkMode
}) => {
  const reactFlowWrapper = useRef(null);
  const { fitView, setViewport } = useReactFlow();

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2 });
  }, [fitView]);

  const handleResetView = useCallback(() => {
    setViewport({ x: 0, y: 0, zoom: 1 });
  }, [setViewport]);

  const handleExport = useCallback(() => {
    const data = { nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleImport = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          console.log('Import data:', data);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  }, []);

  return (
    <div 
      ref={reactFlowWrapper} 
      className="w-full h-full"
      style={{ background: isDarkMode ? '#1F2937' : '#F9FAFB' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 100, y: 100, zoom: 0.8 }}
        minZoom={0.1}
        maxZoom={2}
        snapToGrid={true}
        snapGrid={[20, 20]}
        connectionLineType="smoothstep"
        fitView
      >
        <Background 
          color={isDarkMode ? '#4B5563' : '#CBD5E1'} 
          gap={20} 
          size={1}
        />
        
        <Controls 
          className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        />
        
        <MiniMap 
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            const colors = {
              default: '#3B82F6',
              topic: '#8B5CF6',
              subtopic: '#10B981',
              detail: '#F59E0B',
              reference: '#6B7280'
            };
            return colors[node.data.type] || colors.default;
          }}
          maskColor={isDarkMode ? 'rgba(31, 41, 55, 0.6)' : 'rgba(249, 250, 251, 0.6)'}
          className={`border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        />
        
        <Panel position="top-right" className="flex gap-2 m-4">
          <button
            onClick={handleFitView}
            className={`p-2 rounded-lg shadow flex items-center gap-2 ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
            title="Fit to view"
          >
            <FiMaximize2 />
          </button>
          <button
            onClick={handleResetView}
            className={`p-2 rounded-lg shadow flex items-center gap-2 ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
            title="Reset view"
          >
            <FiRefreshCw />
          </button>
          <button
            onClick={handleExport}
            className={`p-2 rounded-lg shadow flex items-center gap-2 ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
            title="Export JSON"
          >
            <FiDownload />
          </button>
          <label className={`p-2 rounded-lg shadow flex items-center gap-2 cursor-pointer ${
            isDarkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
          }`}>
            <FiUpload />
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </Panel>
      </ReactFlow>
    </div>
  );
};