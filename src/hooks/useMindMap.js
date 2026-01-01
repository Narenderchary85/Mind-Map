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
  nodeCounter: 1,
  currentLevel: 0,
  maxLevel: 3,
  
  initializeMindMap: () => {
    // Calculate positions for circular layout
    const processedNodes = mindmapData.nodes.map((node, index) => {
      let position = { x: 0, y: 0 };
      
      // Set positions based on hierarchy
      if (node.id === 'root') {
        position = { x: 500, y: 300 }; // Center
      } else if (node.id.startsWith('cat_')) {
        // Category nodes arranged in a circle around root
        const angle = (Math.PI * 2 * index) / 4;
        const radius = 200;
        position = {
          x: 500 + radius * Math.cos(angle),
          y: 300 + radius * Math.sin(angle)
        };
      } else if (node.id.startsWith('sub_')) {
        // Subcategory nodes arranged around their parent
        const parentId = mindmapData.hierarchy[node.id]?.[0];
        if (parentId) {
          const parentNode = mindmapData.nodes.find(n => n.id === parentId);
          if (parentNode) {
            const angle = (Math.PI * 2 * index) / 8;
            const radius = 150;
            position = {
              x: 500 + radius * Math.cos(angle),
              y: 300 + radius * Math.sin(angle)
            };
          }
        }
      }
      
      return {
        ...node,
        position,
        data: {
          ...node.data,
          isExpanded: true,
          level: getNodeLevel(node.id) || 0,
          onUpdateNode: (id, updates) => get().onUpdateNode(id, updates),
          onAddNode: (parentId, type) => get().onAddNode(parentId, type),
          onCollapseExpand: (nodeId) => get().onCollapseExpand(nodeId)
        }
      };
    });
    
    set({ 
      nodes: processedNodes,
      edges: mindmapData.edges.map(edge => ({
        ...edge,
        type: 'smoothstep',
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
      })),
      nodeCounter: mindmapData.nodes.length + 1,
      maxLevel: calculateMaxLevel()
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
        type: 'smoothstep', 
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
  
  // View controls
  onFitView: () => {
    console.log('Fit to view');
  },
  
  onResetView: () => {
    console.log('Reset view');
  },
  
  onExpandAll: () => {
    set({
      nodes: get().nodes.map(node => ({
        ...node,
        data: { ...node.data, isExpanded: true }
      })),
      currentLevel: get().maxLevel
    });
  },
  
  onCollapseAll: () => {
    set({
      nodes: get().nodes.map(node => ({
        ...node,
        data: { ...node.data, isExpanded: false }
      })),
      currentLevel: 0
    });
  },
  
  onDrillDown: () => {
    const currentLevel = get().currentLevel;
    const maxLevel = get().maxLevel;
    
    if (currentLevel < maxLevel) {
      set({ currentLevel: currentLevel + 1 });
      // Show nodes up to new level
      get().showNodesUpToLevel(currentLevel + 1);
    }
  },
  
  onDrillUp: () => {
    const currentLevel = get().currentLevel;
    
    if (currentLevel > 0) {
      set({ currentLevel: currentLevel - 1 });
      // Show nodes up to new level
      get().showNodesUpToLevel(currentLevel - 1);
    }
  },
  
  showNodesUpToLevel: (targetLevel) => {
    const nodes = get().nodes.map(node => {
      const nodeLevel = node.data.level || 0;
      const isVisible = nodeLevel <= targetLevel;
      
      return {
        ...node,
        data: {
          ...node.data,
          isVisible: isVisible
        }
      };
    });
    
    set({ nodes });
  },
  
  // Node operations
  onUpdateNode: (nodeId, updates) => {
    set({
      nodes: get().nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updates,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          };
        }
        return node;
      }),
      selectedNode: get().selectedNode?.id === nodeId 
        ? { ...get().selectedNode, data: { ...get().selectedNode.data, ...updates } }
        : get().selectedNode
    });
  },
  
  onAddNode: (parentId = null, type = 'subtopic') => {
    const nodes = get().nodes;
    
    if (!parentId && get().selectedNode) {
      parentId = get().selectedNode.id;
    }
    
    // Find parent node for positioning
    const parentNode = parentId ? nodes.find(n => n.id === parentId) : null;
    
    // Calculate position based on parent or random
    let position;
    if (parentNode) {
      // Position child near parent
      const childCount = nodes.filter(n => 
        get().edges.some(e => e.source === parentId && e.target === n.id)
      ).length;
      
      const angle = (Math.PI * 2 * childCount) / 8;
      const radius = 150;
      position = {
        x: parentNode.position.x + radius * Math.cos(angle),
        y: parentNode.position.y + radius * Math.sin(angle)
      };
    } else {
      // Create as root node
      position = {
        x: 300 + Math.random() * 400,
        y: 200 + Math.random() * 200
      };
    }
    
    const newNodeId = `node-${get().nodeCounter}`;
    const newNodeLevel = parentNode ? (parentNode.data.level || 0) + 1 : 0;
    
    const newNode = {
      id: newNodeId,
      type: 'circularNode',
      position,
      data: {
        label: `New ${type} Node`,
        summary: 'Click to edit this node',
        type: type,
        level: newNodeLevel,
        tags: ['new'],
        isExpanded: true,
        isVisible: newNodeLevel <= get().currentLevel,
        childrenCount: 0,
        connectionCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        onUpdateNode: (id, updates) => get().onUpdateNode(id, updates),
        onAddNode: (parentId, type) => get().onAddNode(parentId, type),
        onCollapseExpand: (nodeId) => get().onCollapseExpand(nodeId)
      }
    };
    
    // Add edge if there's a parent
    let newEdges = [...get().edges];
    if (parentNode) {
      const newEdge = {
        id: `edge-${parentId}-${newNodeId}`,
        source: parentId,
        target: newNodeId,
        type: 'smoothstep',
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
    }
    
    set({
      nodes: [...nodes, newNode],
      edges: newEdges,
      nodeCounter: get().nodeCounter + 1,
      selectedNode: newNode
    });
  },
  
  onRemoveNode: (nodeId) => {
    const nodes = get().nodes;
    const edges = get().edges;
    const node = nodes.find(n => n.id === nodeId);
    
    if (node && window.confirm(`Delete node "${node.data.label}"?`)) {
      const newNodes = nodes.filter(n => n.id !== nodeId);
      const newEdges = edges.filter(e => 
        e.source !== nodeId && e.target !== nodeId
      );
      
      set({
        nodes: newNodes,
        edges: newEdges,
        selectedNode: get().selectedNode?.id === nodeId ? null : get().selectedNode,
        hoveredNode: get().hovererNode?.id === nodeId ? null : get().hoveredNode
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

// Helper function to calculate node level from hierarchy
function getNodeLevel(nodeId, hierarchy = mindmapData.hierarchy, level = 0) {
  // Find parent of this node
  for (const [parentId, children] of Object.entries(hierarchy)) {
    if (children.includes(nodeId)) {
      return getNodeLevel(parentId, hierarchy, level + 1);
    }
  }
  return level;
}

// Calculate maximum depth of hierarchy
function calculateMaxLevel() {
  let maxLevel = 0;
  
  for (const nodeId of Object.keys(mindmapData.hierarchy)) {
    const level = getNodeLevel(nodeId);
    if (level > maxLevel) maxLevel = level;
  }
  
  return maxLevel;
}