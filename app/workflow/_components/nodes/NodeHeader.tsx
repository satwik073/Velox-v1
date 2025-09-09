"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppNode, TaskType } from "@/lib/types";
import { createFlowNode } from "@/lib/workflow/CreateFlowNode";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { useReactFlow } from "@xyflow/react";
import { Coins, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
import React, { Fragment } from "react";

function NodeHeader({
  taskType,
  nodeId,
}: {
  taskType: TaskType;
  nodeId: string;
}) {
  const task = TaskRegistry[taskType];

  const { deleteElements, getNode, addNodes } = useReactFlow();

  const copyNode = () => {
    const node = getNode(nodeId) as AppNode;
    const newX = node.position.x;
    const newY = node.position.y + node.measured?.height! + 20;
    const newNode = createFlowNode(node.data.type, { x: newX, y: newY });
    addNodes([newNode]);
  };

  return (
    <div className="relative px-4 py-3 border-b border-slate-200/40 dark:border-slate-700/40">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50/40 to-transparent dark:from-slate-800/20 rounded-t-xl" />
      
      <div className="relative flex items-center gap-3">
        {/* Icon with enhanced styling */}
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/15 dark:to-purple-400/15 flex items-center justify-center border border-slate-200/30 dark:border-slate-700/30 shadow-sm">
          <task.icon size={16} className="text-slate-700 dark:text-slate-300" />
        </div>
        
        <div className="flex items-center justify-between w-full min-w-0">
          {/* Task label with better typography */}
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {task.label}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {task.type.replace(/_/g, ' ').toLowerCase()}
            </p>
          </div>
          
          {/* Action buttons with modern styling */}
          <div className="flex items-center gap-1 ml-2">
            {task.isEntryPoint && (
              <Badge className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 shadow-sm">
                Entry Point
              </Badge>
            )}
            
            <Badge className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 shadow-sm">
              <Coins size={12} />
              {task.credits}
            </Badge>
            
            {!task.isEntryPoint && (
              <Fragment>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    deleteElements({
                      nodes: [{ id: nodeId }],
                    })
                  }
                  className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors rounded-md"
                >
                  <TrashIcon size={12} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyNode}
                  className="h-7 w-7 p-0 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors rounded-md"
                >
                  <CopyIcon size={12} />
                </Button>
              </Fragment>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="drag-handle cursor-grab h-7 w-7 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-md"
            >
              <GripVerticalIcon size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NodeHeader;
