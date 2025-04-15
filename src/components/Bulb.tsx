import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Lightbulb } from 'lucide-react';

interface BulbProps {
  data: {
    label: string;
    state: boolean;
  };
  selected: boolean;
}

export const Bulb = memo(({ data, selected }: BulbProps) => {
  return (
    <div
      className={`
        px-4 py-2 rounded-lg shadow-lg border-2
        ${selected ? 'border-blue-500' : 'border-gray-300'}
        dark:bg-gray-800 bg-white
        transition-colors duration-200
        min-w-[100px]
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 !bg-blue-500"
      />

      <div className="flex items-center justify-center gap-2">
        <Lightbulb
          size={24}
          className={`${
            data.state
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-400 dark:text-gray-600'
          } transition-colors duration-200`}
        />
        <div className="font-mono font-bold text-sm dark:text-white">
          {data.label}
        </div>
      </div>
    </div>
  );
});