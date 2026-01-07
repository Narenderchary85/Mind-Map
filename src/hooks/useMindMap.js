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
        onAddNode: (parentId, type) => get().onAddNode(parentId, type),
        onCollapseExpand: (nodeId) => get().onCollapseExpand(nodeId)
      }
    }));
    
    set({ 
      nodes: initialNodes,
      edges: mindmapData.edges.map(edge => ({
        ...edge,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.Arrow,
          height: '20px',
          width: '20px'
        },
        style: {
          strokeWidth: 2,
          stroke: '#4B5563'
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
          : '#4B5563',
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
          stroke: '#4B5563',
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
        type: 'smoothstep', 
        animated: false,
        markerEnd: {
          type: MarkerType.Arrow,
          height: '20px',
          width: '20px'
        },
        style: {
          strokeWidth: 2,
          stroke: '#4B5563'
        }
      }, get().edges),
    });
  },
  onFitView: () => {
    console.log('Fit to view - implement in view component');
  },
  
  onResetView: () => {
    console.log('Reset view - implement in view component');
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
  
  onAddNode: (parentId = null, type = 'default') => {
    const nodes = get().nodes;
    
    if (!parentId && get().selectedNode) {
      parentId = get().selectedNode.id;
    }
    let parentNode;
    let newNodePosition;
    
    if (parentId && nodes.find(n => n.id === parentId)) {
      parentNode = nodes.find(n => n.id === parentId);
      newNodePosition = {
        x: parentNode.position.x + 300,
        y: parentNode.position.y
      };
    } else {
      // Create as root node
      newNodePosition = {
        x: 400,
        y: Math.max(...nodes.map(n => n.position.y), 0) + 150
      };
    }
    
    const newNodeId = `node-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: 'mindmapNode',
      position: newNodePosition,
      data: {
        label: `New ${type} Node`,
        summary: 'Click to edit this node',
        type: type,
        tags: ['new'],
        isExpanded: true,
        children: [],
        childrenCount: 0,
        connectionCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        onUpdateNode: (id, updates) => get().onUpdateNode(id, updates),
        onAddNode: (parentId, type) => get().onAddNode(parentId, type),
        onCollapseExpand: (nodeId) => get().onCollapseExpand(nodeId)
      }
    };
    
    const newEdges = [...get().edges];
    
    // If we have a parent, create edge between parent and new node
    if (parentNode) {
      const newEdge = {
        id: `edge-${parentNode.id}-${newNodeId}`,
        source: parentNode.id,
        target: newNodeId,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.Arrow,
          height: '20px',
          width: '20px'
        },
        style: {
          strokeWidth: 2,
          stroke: '#4B5563'
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
    
    // Add the new node
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
    
    if (node && window.confirm(`Delete node "${node.data.label}" and all its connections?`)) {
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
  }
}));