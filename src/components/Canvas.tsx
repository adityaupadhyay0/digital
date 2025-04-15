import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  NodeChange,
  EdgeChange,
  Connection,
  Node,
} from 'reactflow';
import { useStore } from '../lib/store';
import { LogicGate } from './LogicGate';
import { Bulb } from './Bulb';
import { History } from './History';
import { Toolbar } from './Toolbar';

const nodeTypes = {
  logicGate: LogicGate,
  bulb: Bulb,
};

export function Canvas() {
  const {
    nodes,
    edges,
    isDarkMode,
    zoom,
    position,
    addNode,
    removeNode,
    addEdge,
    removeEdge,
    updateZoom,
    updatePosition,
    updateNodePosition,
  } = useStore();

  const { fitView } = useReactFlow();

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    changes.forEach((change) => {
      if (change.type === 'remove') {
        removeNode(change.id);
      } else if (change.type === 'position' && change.position) {
        updateNodePosition(change.id, change.position);
      }
    });
  }, [removeNode, updateNodePosition]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    changes.forEach((change) => {
      if (change.type === 'remove') {
        removeEdge(change.id);
      }
    });
  }, [removeEdge]);

  const onConnect = useCallback((params: Connection) => {
    if (params.source && params.target) {
      addEdge({
        id: `e${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        type: 'smoothstep',
      });
    }
  }, [addEdge]);

  return (
    <div className={`w-full h-screen ${isDarkMode ? 'dark' : ''}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onMoveEnd={(_, zoom) => {
          updateZoom(zoom);
          updatePosition(position.x, position.y);
        }}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-left">
          <Toolbar />
        </Panel>
        <Panel position="top-right">
          <History />
        </Panel>
      </ReactFlow>
    </div>
  );
}