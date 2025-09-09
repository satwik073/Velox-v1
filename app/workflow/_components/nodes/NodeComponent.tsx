import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "@/lib/types";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import NodeInput from "./NodeInput";
import NodeOutput from "./params/NodeOutput";
import NodeIO from "./NodeIO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Database, Maximize2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import NodeDataDetailsModal from "./NodeDataDetailsModal";

const DEV_MODE = process?.env?.NEXT_PUBLIC_DEV_MODE === "true";

const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const task = TaskRegistry[nodeData.type];
  const [showExtractedData, setShowExtractedData] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const hasExtractedData = nodeData.extractedData && nodeData.extractedDataKey;
  
  // Debug logging
  console.log('NodeComponent render:', props.id, {
    hasExtractedData,
    extractedData: nodeData.extractedData,
    extractedDataKey: nodeData.extractedDataKey,
    extractedDataTimestamp: nodeData.extractedDataTimestamp
  });

  return (
    <NodeCard nodeId={props.id} isSelected={!!props.selected}>
      {DEV_MODE && <Badge>DEV:{props.id}</Badge>}
      <NodeHeader taskType={nodeData.type} nodeId={props.id} />
      
      {/* Extracted Data Section */}
      {hasExtractedData && (
        <div className="border-t border-muted p-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <Database size={12} className="text-primary" />
              <span className="text-xs font-medium text-muted-foreground">
                From Latest Run
              </span>
              {nodeData.extractedDataTimestamp && (
                <span className="text-xs text-muted-foreground">
                  ({formatDistanceToNow(new Date(nodeData.extractedDataTimestamp), { addSuffix: true })})
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowExtractedData(!showExtractedData);
                }}
                className="h-5 px-1 text-xs"
              >
                {showExtractedData ? <EyeOff size={10} /> : <Eye size={10} />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetailsModal(true);
                }}
                className="h-5 px-1 text-xs"
                title="Show detailed data"
              >
                <Maximize2 size={10} />
              </Button>
            </div>
          </div>
          
          {showExtractedData && (
            <div className="bg-muted/50 rounded p-2 text-xs">
              <div className="text-muted-foreground mb-1 flex items-center gap-1">
                <span className="font-medium">{nodeData.extractedDataKey}:</span>
                {nodeData.phaseName && (
                  <span className="text-xs opacity-75">({nodeData.phaseName})</span>
                )}
              </div>
              <div className="max-h-20 overflow-y-auto rounded">
                <SyntaxHighlighter
                  language={typeof nodeData.extractedData === 'string' ? 'js' : 'json'}
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    fontSize: '10px',
                    lineHeight: '1.2',
                    background: 'transparent',
                    padding: '4px',
                    borderRadius: '4px',
                  }}
                  showLineNumbers={false}
                  wrapLines={true}
                  wrapLongLines={true}
                >
                  {typeof nodeData.extractedData === 'string' 
                    ? (nodeData.extractedData.length > 200 
                        ? `${nodeData.extractedData.substring(0, 200)}...` 
                        : nodeData.extractedData)
                    : JSON.stringify(nodeData.extractedData, null, 2)
                  }
                </SyntaxHighlighter>
              </div>
            </div>
          )}
        </div>
      )}
      
      <NodeIO>
        {task.inputs.map((input) => (
          <NodeInput input={input} key={input.name} nodeId={props.id} />
        ))}
      </NodeIO>
      <NodeIO>
        {task.outputs.map((output) => (
          <NodeOutput output={output} key={output.name} />
        ))}
      </NodeIO>

      {/* Node Data Details Modal */}
      <NodeDataDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        nodeData={nodeData}
        nodeId={props.id}
      />
    </NodeCard>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
