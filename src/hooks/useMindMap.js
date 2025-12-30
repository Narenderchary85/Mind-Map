import { create } from 'zustand';
import { 
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType
} from 'reactflow';
import mindmapData from '../data/mindmapData.json';

export const useMindMapStore = create((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  hoveredNode: null,
  
  initializeMindMap: () => {
    const initialNodes = mindmapData.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        isExpanded: true,
        onUpdateNode: (id, updates) => get().onUpdateNode(id, updates),
        onAddNode: (parentId, type, shape) => get().onAddNode(parentId, type, shape),
        onCollapseExpand: (nodeId) => get().onCollapseExpand(nodeId),
        onChangeNodeShape: (nodeId, shape) => get().onChangeNodeShape(nodeId, shape),
        onChangeNodeColor: (nodeId, color) => get().onChangeNodeColor(nodeId, color)
      }
    }));
    
    set({ 
      nodes: initialNodes,
      edges: mindmapData.edges.map(edge => ({
        ...edge,
        type: 'default',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          height: '15px',
          width: '15px',
          color: '#6B7280'
        },
        style: {
          strokeWidth: 2,
          stroke: '#6B7280'
        }
      }))
    });
  },
  
  onNodeClick: (event, node) => {
    const currentSelected = get().selectedNode;
    
    if (currentSelected?.id === node.id) {
      get().onCollapseExpand(node.id);
    }
    
    set({ selectedNode: node });
  },
  
  onNodeMouseEnter: (event, node) => {
    set({ hoveredNode: node });
    
    const { edges } = get();
    const updatedEdges = edges.map(edge => ({
      ...edge,
      animated: edge.source === node.id || edge.target === node.id,
      style: {
        ...edge.style,
        stroke: (edge.source === node.id || edge.target === node.id) 
          ? '#3B82F6' 
          : '#6B7280',
        strokeWidth: (edge.source === node.id || edge.target === node.id) 
          ? 3 
          : 2
      }
    }));
    
    set({ edges: updatedEdges });
  },
  
  onNodeMouseLeave: () => {
    const { hoveredNode } = get();
    if (hoveredNode) {
      const { edges } = get();
      const updatedEdges = edges.map(edge => ({
        ...edge,
        animated: false,
        style: {
          ...edge.style,
          stroke: '#6B7280',
          strokeWidth: 2
        }
      }));
      
      set({ 
        edges: updatedEdges,
        hoveredNode: null 
      });
    }
  },
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection) => {
    set({
      edges: addEdge({
        ...connection, 
        type: 'default',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          height: '15px',
          width: '15px',
          color: '#6B7280'
        },
        style: {
          strokeWidth: 2,
          stroke: '#6B7280'
        }
      }, get().edges),
    });
  },
  
  onFitView: () => {
    console.log('Fit to view');
  },
  
  onResetView: () => {
    console.log('Reset view');
  },
  
  onUpdateNode: (nodeId, updates) => {
    set({
      nodes: get().nodes.map(node => {
        if (node.id === nodeId) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              ...updates,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          };
          return updatedNode;
        }
        return node;
      }),
      selectedNode: get().selectedNode?.id === nodeId 
        ? { ...get().selectedNode, data: { ...get().selectedNode.data, ...updates } }
        : get().selectedNode
    });
  },
  
  onAddNode: (parentId = null, type = 'subtopic', shape = 'oval') => {
    const nodes = get().nodes;
    
    if (!parentId && get().selectedNode) {
      parentId = get().selectedNode.id;
    }
    
    let parentNode;
    let newNodePosition;
    
    if (parentId && nodes.find(n => n.id === parentId)) {
      parentNode = nodes.find(n => n.id === parentId);
      // Calculate position based on existing children
      const childNodes = edges
        .filter(e => e.source === parentId)
        .map(e => nodes.find(n => n.id === e.target))
        .filter(Boolean);
      
      const angleStep = (2 * Math.PI) / (childNodes.length + 1);
      const radius = 200;
      const angle = childNodes.length * angleStep;
      
      newNodePosition = {
        x: parentNode.position.x + radius * Math.cos(angle),
        y: parentNode.position.y + radius * Math.sin(angle)
      };
    } else {
      // Create as root node
      newNodePosition = {
        x: 500 + (Math.random() - 0.5) * 200,
        y: 300 + (Math.random() - 0.5) * 200
      };
    }
    
    const newNodeId = `node-${Date.now()}`;
    const newNodeType = parentNode ? 'childNode' : 'parentNode';
    
    const newNode = {
      id: newNodeId,
      type: newNodeType,
      position: newNodePosition,
      data: {
        label: `New ${type} Node`,
        summary: 'Click to edit this node',
        type: type,
        shape: shape,
        color: parentNode ? '#10B981' : '#3B82F6',
        tags: ['new'],
        isExpanded: true,
        childrenCount: 0,
        connectionCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        onUpdateNode: (id, updates) => get().onUpdateNode(id, updates),
        onAddNode: (parentId, type, shape) => get().onAddNode(parentId, type, shape),
        onCollapseExpand: (nodeId) => get().onCollapseExpand(nodeId),
        onChangeNodeShape: (nodeId, shape) => get().onChangeNodeShape(nodeId, shape),
        onChangeNodeColor: (nodeId, color) => get().onChangeNodeColor(nodeId, color)
      }
    };
    
    const newEdges = [...get().edges];
    
    if (parentNode) {
      const newEdge = {
        id: `edge-${parentNode.id}-${newNodeId}`,
        source: parentNode.id,
        target: newNodeId,
        type: 'default',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          height: '15px',
          width: '15px',
          color: '#6B7280'
        },
        style: {
          strokeWidth: 2,
          stroke: '#6B7280'
        }
      };
      newEdges.push(newEdge);
      
      set({
        nodes: nodes.map(node => {
          if (node.id === parentNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                childrenCount: (node.data.childrenCount || 0) + 1
              }
            };
          }
          return node;
        }),
        edges: newEdges
      });
    }
    
    set({
      nodes: [...nodes, newNode],
      edges: newEdges,
      selectedNode: newNode
    });
  },
  
  onDeleteNode: (nodeId) => {
    const nodes = get().nodes;
    const edges = get().edges;
    const node = nodes.find(n => n.id === nodeId);
    
    if (node && window.confirm(`Delete node "${node.data.label}"?`)) {
      const newNodes = nodes.filter(n => n.id !== nodeId);
      const newEdges = edges.filter(e => 
        e.source !== nodeId && e.target !== nodeId
      );
      
      const updatedNodes = newNodes.map(n => {
        const childEdges = edges.filter(e => e.source === n.id && e.target === nodeId);
        if (childEdges.length > 0) {
          return {
            ...n,
            data: {
              ...n.data,
              childrenCount: Math.max(0, (n.data.childrenCount || 0) - 1)
            }
          };
        }
        return n;
      });
      
      set({
        nodes: updatedNodes,
        edges: newEdges,
        selectedNode: get().selectedNode?.id === nodeId ? null : get().selectedNode,
        hoveredNode: get().hoveredNode?.id === nodeId ? null : get().hoveredNode
      });
    }
  },
  
  onCollapseExpand: (nodeId) => {
    set({
      nodes: get().nodes.map(node => {
        if (node.id === nodeId) {
          const isExpanded = !node.data.isExpanded;
          return {
            ...node,
            data: {
              ...node.data,
              isExpanded,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          };
        }
        return node;
      })
    });
  },
  
  onChangeNodeShape: (nodeId, shape) => {
    set({
      nodes: get().nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              shape,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          };
        }
        return node;
      }),
      selectedNode: get().selectedNode?.id === nodeId 
        ? { ...get().selectedNode, data: { ...get().selectedNode.data, shape } }
        : get().selectedNode
    });
  },
  
  onChangeNodeColor: (nodeId, color) => {
    set({
      nodes: get().nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              color,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          };
        }
        return node;
      }),
      selectedNode: get().selectedNode?.id === nodeId 
        ? { ...get().selectedNode, data: { ...get().selectedNode.data, color } }
        : get().selectedNode
    });
  }
}));