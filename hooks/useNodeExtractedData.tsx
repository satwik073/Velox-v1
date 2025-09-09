"use client";

import { useCallback } from "react";
import { getWorkflowExecutions } from "@/actions/workflows";
import { AppNode } from "@/lib/types";

export function useNodeExtractedData() {
  const fetchAndUpdateNodeData = useCallback(
    async (workflowId: string, nodes: AppNode[], setNodes: (nodes: AppNode[] | ((nodes: AppNode[]) => AppNode[])) => void) => {
      try {
        // Get the latest execution for this workflow
        const executions = await getWorkflowExecutions(workflowId);
        if (!executions || executions.length === 0) return;

        const latestExecution = executions[0]; // Already sorted by desc in the action
        
        // Get the execution with phases
        const response = await fetch(`/api/workflows/execution/${latestExecution.id}`);
        if (!response.ok) return;
        
        const executionData = await response.json();
        if (!executionData?.phases) return;

        // Create a map of node IDs to their latest extracted data
        const nodeDataMap = new Map<string, any>();
        
        executionData.phases.forEach((phase: any) => {
          if (phase.outputs) {
            try {
              const outputs = JSON.parse(phase.outputs);
              // Look for common extracted data keys
              const dataKeys = ['extractedData', 'data', 'result', 'content', 'text', 'html', 'url'];
              const foundData = dataKeys.find(key => outputs[key]);
              
              if (foundData && outputs[foundData]) {
                // Try to find the corresponding node by matching the phase name or node type
                const node = nodes.find(n => {
                  // Match by phase name or by checking if this phase corresponds to this node
                  const phaseNameLower = phase.name?.toLowerCase() || '';
                  const nodeTypeLower = n.data.type.toLowerCase();
                  
                  // Direct type matching
                  if (phaseNameLower.includes(nodeTypeLower) || nodeTypeLower.includes(phaseNameLower)) {
                    return true;
                  }
                  
                  // More specific matching for common task types
                  const taskTypeMappings: Record<string, string[]> = {
                    'LAUNCH_BROWSER': ['launch', 'browser', 'start'],
                    'PAGE_TO_HTML': ['page', 'html', 'get html'],
                    'EXTRACT_TEXT_FROM_ELEMENT': ['extract', 'text', 'element'],
                    'EXTRACT_DATA_WITH_AI': ['extract', 'ai', 'data'],
                    'NAVIGATE_URL': ['navigate', 'url', 'go to'],
                    'CLICK_ELEMENT': ['click', 'element'],
                    'FILL_INPUT': ['fill', 'input'],
                    'WAIT_FOR_ELEMENT': ['wait', 'element'],
                    'SCROLL_TO_ELEMENT': ['scroll', 'element']
                  };
                  
                  const keywords = taskTypeMappings[n.data.type] || [];
                  return keywords.some(keyword => phaseNameLower.includes(keyword));
                });
                
                if (node) {
                  nodeDataMap.set(node.id, {
                    data: outputs[foundData],
                    key: foundData,
                    phaseName: phase.name,
                    timestamp: phase.completedAt
                  });
                }
              }
            } catch (error) {
              console.error('Error parsing phase outputs:', error);
            }
          }
        });

        // Update nodes with extracted data
        setNodes((currentNodes) => 
          currentNodes.map(node => {
            const extractedData = nodeDataMap.get(node.id);
            if (extractedData) {
              return {
                ...node,
                data: {
                  ...node.data,
                  extractedData: extractedData.data,
                  extractedDataKey: extractedData.key,
                  extractedDataTimestamp: extractedData.timestamp
                }
              };
            }
            return node;
          })
        );
      } catch (error) {
        console.error('Error fetching node extracted data:', error);
      }
    },
    []
  );

  return { fetchAndUpdateNodeData };
}
