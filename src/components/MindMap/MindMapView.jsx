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
      
    </div>
  );
};