"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TaskType } from "@/lib/types";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CoinsIcon, Info } from "lucide-react";
import TaskDescriptionSidebar from "./TaskDescriptionSidebar";

function TaskMenu() {
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType | null>(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const handleTaskClick = (taskType: TaskType) => {
    setSelectedTaskType(taskType);
    setIsDescriptionOpen(true);
  };

  const handleCloseDescription = () => {
    setIsDescriptionOpen(false);
    setSelectedTaskType(null);
  };

  return (
    <>
      <aside className="w-[400px] min-w-[400px] max-w-[400px] border-r border-[#2F3033] dark:border-[#2F3033] h-full bg-gradient-to-b from-[#1A1D21] to-[#161920] dark:from-[#1A1D21] dark:to-[#161920] overflow-auto">
      {/* Header Section */}
      <div className="p-6 border-b border-[#2F3033] dark:border-[#2F3033] bg-gradient-to-r from-[#1A1D21] to-[#1f2227] dark:from-[#1A1D21] dark:to-[#1f2227]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#266DF0] to-[#1e5bcc] rounded-xl flex items-center justify-center shadow-lg ring-2 ring-[#266DF0]/20">
            <div className="w-5 h-5 bg-white rounded-md shadow-sm"></div>
          </div>
          <div>
            <h2 className="font-bold text-[#eef1f5] dark:text-[#eef1f5] text-lg">Untitled Workflow</h2>
            <p className="text-sm text-[#8b949e] dark:text-[#8b949e]">Add a description...</p>
          </div>
        </div>
      </div>

      {/* Checklist Section */}
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#266DF0] to-[#1e5bcc] rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h3 className="font-bold text-[#eef1f5] dark:text-[#eef1f5] text-lg">Checklist</h3>
          </div>
          <p className="text-sm text-[#8b949e] dark:text-[#8b949e] ml-11">Make sure all issues are resolved before publishing</p>
        </div>

        <div className="space-y-4">
          {/* User Interactions Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#eef1f5] dark:text-[#eef1f5] uppercase tracking-wider">User Interactions</h4>
            <div className="space-y-2">
              <TaskMenuButton taskType={TaskType.FILL_INPUT} onTaskClick={handleTaskClick} />
              <TaskMenuButton taskType={TaskType.CLICK_ELEMENT} onTaskClick={handleTaskClick} />
              <TaskMenuButton taskType={TaskType.NAVIGATE_URL} onTaskClick={handleTaskClick} />
              <TaskMenuButton taskType={TaskType.SCROLL_TO_ELEMENT} onTaskClick={handleTaskClick} />
            </div>
          </div>

          {/* Data Extraction Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#eef1f5] dark:text-[#eef1f5] uppercase tracking-wider">Data Extraction</h4>
            <div className="space-y-2">
              <TaskMenuButton taskType={TaskType.PAGE_TO_HTML} onTaskClick={handleTaskClick} />
              <TaskMenuButton taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} onTaskClick={handleTaskClick} />
              <TaskMenuButton taskType={TaskType.EXTRACT_DATA_WITH_AI} onTaskClick={handleTaskClick} />
            </div>
          </div>

          {/* Data Storage Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#eef1f5] dark:text-[#eef1f5] uppercase tracking-wider">Data Storage</h4>
            <div className="space-y-2">
              <TaskMenuButton taskType={TaskType.READ_PROPERTY_FROM_JSON} onTaskClick={handleTaskClick} />
              <TaskMenuButton taskType={TaskType.ADD_PROPERTY_TO_JSON} onTaskClick={handleTaskClick} />
            </div>
          </div>

          {/* Timing Controls Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#eef1f5] dark:text-[#eef1f5] uppercase tracking-wider">Timing Controls</h4>
            <div className="space-y-2">
              <TaskMenuButton taskType={TaskType.WAIT_FOR_ELEMENT} onTaskClick={handleTaskClick} />
            </div>
          </div>

          {/* Result Delivery Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#eef1f5] dark:text-[#eef1f5] uppercase tracking-wider">Result Delivery</h4>
            <div className="space-y-2">
              <TaskMenuButton taskType={TaskType.DELIVER_VIA_WEBHOOK} onTaskClick={handleTaskClick} />
            </div>
          </div>
        </div>
      </div>
      </aside>
      
      {/* Task Description Sidebar */}
      <TaskDescriptionSidebar
        taskType={selectedTaskType}
        isOpen={isDescriptionOpen}
        onClose={handleCloseDescription}
      />
    </>
  );
}

export default TaskMenu;

function TaskMenuButton({ taskType, onTaskClick }: { taskType: TaskType; onTaskClick: (taskType: TaskType) => void }) {
  const task = TaskRegistry[taskType];
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("application/reactflow", taskType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleInfoClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onTaskClick(taskType);
  };
  
  return (
    <div 
      className="group bg-gradient-to-br from-[#22222f] to-[#1e1f2a] dark:from-[#22222f] dark:to-[#1e1f2a] rounded-xl p-4 border border-[#2F3033] dark:border-[#2F3033] hover:border-[#407bf2] dark:hover:border-[#407bf2] hover:shadow-lg hover:shadow-[#407bf2]/10 dark:hover:shadow-[#407bf2]/10 transition-all duration-300 cursor-grab active:cursor-grabbing hover:scale-[1.02] hover:-translate-y-0.5"
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="w-10 h-10 bg-gradient-to-br from-[#266DF0] to-[#1e5bcc] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-[#266DF0]/20 group-hover:ring-[#407bf2]/40 group-hover:scale-110 transition-all duration-300">
          <task.icon size={18} className="text-white drop-shadow-sm" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-[#eef1f5] dark:text-[#eef1f5] text-sm group-hover:text-white dark:group-hover:text-white transition-colors">
              {task.label}
            </h4>
            
            <div className="flex items-center gap-2">
              {/* Credits badge */}
              <div className="flex items-center gap-1 bg-[#2F3033] dark:bg-[#2F3033] px-2 py-1 rounded-md">
                <CoinsIcon size={12} className="text-[#266DF0] dark:text-[#266DF0]" />
                <span className="text-xs text-[#8b949e] dark:text-[#8b949e] group-hover:text-[#a0a6b0] dark:group-hover:text-[#a0a6b0] transition-colors font-medium">
                  {task.credits}
                </span>
              </div>
              
              {/* Info button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleInfoClick}
                className="w-6 h-6 p-0 text-[#8b949e] hover:text-[#eef1f5] hover:bg-[#2F3033] opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <Info size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
