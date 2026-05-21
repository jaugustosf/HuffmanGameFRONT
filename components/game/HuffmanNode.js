import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";

const HuffmanNode = ({ data, selected }) => {
  // Se for nó pai (dourado) ou folha (branco/dark)
  const isParent = data.isParent || false;
  const isUsed = data.isUsed || false;

  return (
    <div 
      className="relative group select-none"
      style={{ width: isParent ? 80 : 50, height: 50 }}
    >
      {/* Handle de entrada (Target) no Topo */}
      <Handle
        type="target"
        position={Position.Top}
        className="opacity-0 pointer-events-none"
        style={{ top: 0 }}
      />

      {/* CARD VISUAL: É este div que anima, não o nó do ReactFlow */}
      <div
        className={`
          flex justify-center items-center text-xs font-bold rounded-lg border-2 shadow-sm
          transition-all duration-200 select-none w-full h-full
          ${isUsed ? "pointer-events-none opacity-40" : "pointer-events-auto opacity-100"}
          ${
            isParent
              ? "bg-[#FFD700] border-[#b8860b] text-black"
              : "bg-white dark:bg-neutral-800 border-neutral-400 dark:border-neutral-600 dark:text-neutral-100"
          }
          ${selected && !isUsed ? "translate-y-3 shadow-lg border-white ring-2 ring-white/30" : ""}
        `}
      >
        <span className="pointer-events-none select-none">{data.label}</span>
      </div>

      {/* Handle de saída (Source) na Base */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="opacity-0 pointer-events-none"
        style={{ bottom: 0 }}
      />
    </div>
  );
};

export default memo(HuffmanNode);
