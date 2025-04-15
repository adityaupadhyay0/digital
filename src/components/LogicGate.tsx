import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { And, Or, X, XCircle, AlertCircle, Ban } from 'lucide-react';
import { useStore } from '../lib/store';

interface LogicGateProps {
  id: string;
  data: {
    label: string;
    type: 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR';
    state?: boolean;
  };
  selected: boolean;
}

const GateIcon = ({ type }: { type: LogicGateProps['data']['type'] }) => {
  switch (type) {
    case 'AND':
      return <And size={20} />;
    case 'OR':
      return <Or size={20} />;
    case 'NOT':
      return <Ban size={20} />;
    case 'XOR':
      return <X size={20} />;
    case 'NAND':
      return <AlertCircle size={20} />;
    case 'NOR':
      return <XCircle size={20} />;
    default:
      return null;
  }
};

export const LogicGate = memo(({ id, data, selected }: LogicGateProps) => {
  const { updateNodeState, nodes, edges } = useStore();
  const isInverter = data.type === 'NOT';

  const evaluateGate = (input1: boolean, input2: boolean | null = null) => {
    switch (data.type) {
      case 'AND':
        return input1 && input2;
      case 'OR':
        return input1 || input2;
      case 'NOT':
        return !input1;
      case 'XOR':
        return Boolean(input1) !== Boolean(input2);
      case 'NAND':
        return !(input1 && input2);
      case 'NOR':
        return !(input1 || input2);
      default:
        return false;
    }
  };

  const handleConnect = (params: any) => {
    const inputEdges = edges.filter(edge => edge.target === id);
    if (!inputEdges.length) return;

    const inputs = inputEdges.map(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      return sourceNode?.data?.state || false;
    });

    const result = evaluateGate(inputs[0], inputs[1]);
    updateNodeState(id, result);

    // Update connected output nodes
    const outputEdges = edges.filter(edge => edge.source === id);
    outputEdges.forEach(edge => {
      const targetNode = nodes.find(n => n.id === edge.target);
      if (targetNode?.type === 'bulb') {
        updateNodeState(targetNode.id, result);
      }
    });
  };

  return (
    <div
      className={`
        px-4 py-2 rounded-lg shadow-lg border-2
        ${selected ? 'border-blue-500' : 'border-gray-300'}
        dark:bg-gray-800 bg-white
        transition-colors duration-200
        min-w-[120px]
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 !bg-blue-500"
        style={{ top: '40%' }}
        onConnect={handleConnect}
      />
      
      {!isInverter && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-2 h-2 !bg-blue-500"
          style={{ top: '70%' }}
          onConnect={handleConnect}
        />
      )}

      <div className="flex items-center justify-center gap-2">
        <GateIcon type={data.type} />
        <div className="font-mono font-bold text-sm dark:text-white">
          {data.label}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 !bg-green-500"
        style={{ top: '50%' }}
      />
    </div>
  );
});