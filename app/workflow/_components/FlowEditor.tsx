"use client";
import { Workflow } from "@prisma/client";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  getOutgoers,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";
import { AppNode, TaskType, WorkflowStatus } from "@/lib/types";
import { createFlowNode } from "@/lib/workflow/CreateFlowNode";
import NodeComponent from "./nodes/NodeComponent";
import DeletableEdge from "./edges/DeletableEdge";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import PublishWorkflowBanner from "./PublishWorkflowBanner";
import { getWorkflowExecutions } from "@/actions/workflows";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};
const edgeTypes = {
  default: DeletableEdge,
};

const snapgird: [number, number] = [50, 50];

const fitViewOptions = { padding: 1 };

function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [hasLoadedExecutionData, setHasLoadedExecutionData] = useState(false);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);

      //TODO:  Optional flow for restoring the view-port used by user for project
      // if (!flow.viewport) return;
      // const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      // setViewport({ x, y, zoom });
    } catch (error) {}
  }, [workflow, setEdges, setNodes, setViewport]);

  // Load execution data when editor loads
  useEffect(() => {
    if (nodes.length > 0 && !hasLoadedExecutionData) {
      setHasLoadedExecutionData(true);
      loadExecutionData();
    }
  }, [nodes, hasLoadedExecutionData, workflow.id]);

  const loadExecutionData = async () => {
    try {
      console.log('Loading execution data for workflow:', workflow.id);
      
      // Get the first execution for this workflow (latest run)
      const executions = await getWorkflowExecutions(workflow.id);
      console.log('Found executions:', executions);
      
      if (!executions || executions.length === 0) {
        console.log('No executions found');
        return;
      }

      // Get the first execution (latest run)
      const firstExecution = executions[0];
      console.log('First execution:', firstExecution);
      
      // Get the execution with phases
      const response = await fetch(`/api/workflows/execution/${firstExecution.id}`);
      if (!response.ok) {
        console.log('Failed to fetch execution details');
        return;
      }
      
      const executionData = await response.json();
      console.log('Execution data with phases:', executionData);
      
      if (!executionData?.phases) {
        console.log('No phases found in execution data');
        return;
      }

      // Create a map of node types to their extracted data
      const nodeDataMap = new Map<string, any>();
      
      executionData.phases.forEach((phase: any) => {
        console.log('Processing phase:', phase.name, phase.outputs);
        
        if (phase.outputs) {
          try {
            const outputs = JSON.parse(phase.outputs);
            console.log('Phase outputs:', outputs);
            
            // Look for any data in outputs
            Object.keys(outputs).forEach(key => {
              if (outputs[key] && outputs[key] !== '') {
                console.log('Found data with key:', key, outputs[key]);
                
                // Map phase to node type based on phase name
                let nodeType = null;
                const phaseNameLower = phase.name?.toLowerCase() || '';
                console.log('Phase name lower:', phaseNameLower);
                
                // Direct mapping based on phase name
                if (phaseNameLower.includes('launch') || phaseNameLower.includes('browser')) {
                  nodeType = 'LAUNCH_BROWSER';
                } else if (phaseNameLower.includes('page') || phaseNameLower.includes('html') || phaseNameLower.includes('get html')) {
                  nodeType = 'PAGE_TO_HTML';
                } else if (phaseNameLower.includes('extract') && phaseNameLower.includes('text')) {
                  nodeType = 'EXTRACT_TEXT_FROM_ELEMENT';
                } else if (phaseNameLower.includes('extract') && phaseNameLower.includes('ai')) {
                  nodeType = 'EXTRACT_DATA_WITH_AI';
                } else if (phaseNameLower.includes('navigate') || phaseNameLower.includes('url')) {
                  nodeType = 'NAVIGATE_URL';
                } else if (phaseNameLower.includes('click')) {
                  nodeType = 'CLICK_ELEMENT';
                } else if (phaseNameLower.includes('fill') || phaseNameLower.includes('input')) {
                  nodeType = 'FILL_INPUT';
                } else if (phaseNameLower.includes('wait')) {
                  nodeType = 'WAIT_FOR_ELEMENT';
                } else if (phaseNameLower.includes('scroll')) {
                  nodeType = 'SCROLL_TO_ELEMENT';
                }
                
                console.log('Determined node type:', nodeType);
                
                if (nodeType) {
                  console.log('Mapped phase to node type:', phaseNameLower, '->', nodeType);
                  nodeDataMap.set(nodeType, {
                    data: outputs[key],
                    key: key,
                    phaseName: phase.name,
                    timestamp: phase.completedAt
                  });
                } else {
                  console.log('No node type matched for phase:', phaseNameLower);
                }
              }
            });
          } catch (error) {
            console.error('Error parsing phase outputs:', error);
          }
        }
      });

      console.log('Node data map:', nodeDataMap);
      console.log('Available node types in workflow:', nodes.map(n => n.data.type));

      // Update nodes with extracted data based on node type
      setNodes((currentNodes) => 
        currentNodes.map(node => {
          const extractedData = nodeDataMap.get(node.data.type);
          if (extractedData) {
            console.log('Updating node with extracted data:', node.id, node.data.type, extractedData);
            return {
              ...node,
              data: {
                ...node.data,
                extractedData: extractedData.data,
                extractedDataKey: extractedData.key,
                extractedDataTimestamp: extractedData.timestamp,
                phaseName: extractedData.phaseName
              }
            };
          }
          return node;
        })
      );
    } catch (error) {
      console.error('Error loading execution data:', error);
    }
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const taskType = event.dataTransfer.getData("application/reactflow");
      if (typeof taskType === undefined || !taskType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = createFlowNode(taskType as TaskType, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, screenToFlowPosition]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      if (!connection.targetHandle) return;
      const node = nodes.find((node) => node.id === connection.target);
      if (!node) return;
      const nodeInputs = node.data.inputs;
      updateNodeData(node.id, {
        inputs: {
          ...nodeInputs,
          [connection.targetHandle]: "",
        },
      });
    },

    [setEdges, updateNodeData, nodes]
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      // No self-connection
      if (connection.source === connection.target) return false;

      // Same type connections
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (!sourceNode || !targetNode) {
        console.log("Source or target not found");
        return false;
      }

      const sourceTask = TaskRegistry[sourceNode.data.type];
      const targetTask = TaskRegistry[targetNode.data.type];

      const output = sourceTask.outputs.find(
        (o) => o.name === connection.sourceHandle
      );
      const input = targetTask.inputs.find(
        (i) => i.name === connection.targetHandle
      );

      if (input?.type !== output?.type) {
        console.log("Invalid connection");
        return false;
      }

      // Avoid cyclic connections :: DOCS_GRAPH
      const hasCycle = (node: AppNode, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      const detectedCycle = hasCycle(targetNode);
      return !detectedCycle;
    },

    [nodes, edges]
  );

  return (
    <main className="h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapgird}
        fitView
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      
      {/* Banner overlay positioned at the top of the React Flow editor */}
      <div className="absolute top-0 left-0 right-0 py-4 px-6 z-10">
        <PublishWorkflowBanner 
          workflowId={workflow.id}
          isPublished={workflow.status === WorkflowStatus.PUBLISHED}
        />
      </div>

      {/* Refresh Data Button */}
      <div className="absolute top-20 right-6 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={loadExecutionData}
          className="flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Load Latest Data
        </Button>
      </div>

    </main>
  );
}

export default FlowEditor;
