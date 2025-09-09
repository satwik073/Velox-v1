"use client";

import useFlowValidation from "@/hooks/useFlowValidation";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import React from "react";

function NodeCard({
  nodeId,
  children,
  isSelected,
}: {
  nodeId: string;
  children: React.ReactNode;
  isSelected: boolean;
}) {
  const { getNode, setCenter } = useReactFlow();

  const centerNode = () => {
    const node = getNode(nodeId);
    if (!node) return;

    const { position, measured } = node;

    if (!position || !measured) return;
    const { width, height } = measured;
    const x = position.x + width! / 2;
    const y = position.y + height! / 2;
    if (x === undefined || y === undefined) return;
    setCenter(x, y, { zoom: 1, duration: 500 });
  };

  const { invalidInputs } = useFlowValidation();
  const hasInvalidInputs = invalidInputs.some((node) => node.nodeId === nodeId);
  return (
    <div
      onDoubleClick={centerNode}
      className={cn(
        "group relative rounded-xl cursor-pointer bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 w-[420px] text-xs gap-1 flex-col shadow-lg hover:shadow-xl transition-all duration-300 ease-out",
        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/60 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        isSelected && "ring-2 ring-blue-500/40 border-blue-400/60 shadow-blue-500/10 bg-blue-50/30 dark:bg-blue-900/20",
        hasInvalidInputs && "ring-2 ring-red-500/40 border-red-400/60 shadow-red-500/10 bg-red-50/30 dark:bg-red-900/20"
      )}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default NodeCard;
