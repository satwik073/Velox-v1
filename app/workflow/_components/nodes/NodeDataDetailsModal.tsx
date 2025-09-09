"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AppNodeData } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { memo, useMemo, useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Database, 
  Clock, 
  Tag, 
  Code, 
  Info,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

interface NodeDataDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData: AppNodeData;
  nodeId: string;
}

// Custom Code Display Component with Syntax Highlighting
const CodeDisplay = memo(({ data, language = 'json' }: { data: any; language?: string }) => {
  const formattedData = useMemo(() => {
    if (typeof data === 'string') {
      // Ensure string data is properly formatted
      return data.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }
    return JSON.stringify(data, null, 2);
  }, [data]);

  const syntaxLanguage = useMemo(() => {
    if (language === 'json' || typeof data === 'object') {
      return 'json';
    }
    if (language === 'text' || typeof data === 'string') {
     
      return 'html';
    }
    return language;
  }, [data, language]);

  return (
    <div className="rounded-lg overflow-hidden w-full min-w-0">
      <SyntaxHighlighter
        language={syntaxLanguage}
        style={oneDark}
        customStyle={{
          margin: 0,
          fontSize: '12px',
          lineHeight: '1.5',
          background: '#1e293b',
          padding: '16px',
          borderRadius: '8px',
          overflow: 'auto',
          maxWidth: '100%',
          width: '100%',
        }}
        showLineNumbers={true}
        wrapLines={false}
        wrapLongLines={false}
        lineNumberStyle={{
          color: '#64748b',
          marginRight: '16px',
          paddingRight: '8px',
          borderRight: '1px solid #334155',
          minWidth: '40px',
          textAlign: 'right',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            fontSize: '12px',
            lineHeight: '1.5',
          }
        }}
      >
        {formattedData}
      </SyntaxHighlighter>
    </div>
  );
});

CodeDisplay.displayName = "CodeDisplay";

const NodeDataDetailsModal = memo(function NodeDataDetailsModal({ 
  isOpen, 
  onClose, 
  nodeData, 
  nodeId 
}: NodeDataDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [processedData, setProcessedData] = useState<AppNodeData | null>(null);

  const hasExtractedData = useMemo(() => 
    processedData?.extractedData && processedData?.extractedDataKey, 
    [processedData?.extractedData, processedData?.extractedDataKey]
  );

  // Process data after modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Use setTimeout to allow modal to render first, then process data
      const timer = setTimeout(() => {
        setProcessedData(nodeData);
        setIsLoading(false);
      }, 100); // Small delay to ensure modal renders first

      return () => clearTimeout(timer);
    } else {
      // Reset when modal closes
      setIsLoading(true);
      setProcessedData(null);
    }
  }, [isOpen, nodeData]);

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="space-y-6 w-full min-w-0">
      {/* Node Information Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>

      {/* Extracted Data Section Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Database size={20} className="text-primary" />
          <Skeleton className="h-6 w-32" />
        </div>
        
        <div className="border rounded-lg p-4 w-full min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Code size={16} className="text-muted-foreground" />
              <Skeleton className="h-4 w-24" />
            </div>
            
            <div className="max-h-96 overflow-y-auto overflow-x-hidden w-full min-w-0">
              <div className="rounded-lg overflow-hidden w-full min-w-0">
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Statistics Skeleton */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <Skeleton className="h-4 w-12 mb-1" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Node Inputs Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="border rounded-lg p-4 w-full min-w-0">
          <div className="rounded-lg overflow-hidden w-full min-w-0">
            <div className="bg-slate-900 rounded-lg p-4">
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      case 'running':
        return <Loader2 size={16} className="text-blue-500 animate-spin" />;
      case 'pending':
        return <AlertCircle size={16} className="text-yellow-500" />;
      default:
        return <Info size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database size={20} className="text-primary" />
            Node Data Details - {nodeId}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="space-y-6 w-full min-w-0">
            {/* Node Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Node Type</span>
                </div>
                <div className="font-semibold capitalize">
                  {processedData?.type?.replace(/_/g, ' ').toLowerCase()}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                </div>
                <div className="font-semibold">
                  {processedData?.extractedDataTimestamp 
                    ? formatDistanceToNow(new Date(processedData.extractedDataTimestamp), { addSuffix: true })
                    : 'Never'
                  }
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(processedData?.status)}
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                </div>
                <div className="font-semibold">
                  <Badge className={getStatusColor(processedData?.status)}>
                    {processedData?.status || 'Unknown'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Phase Information */}
            {processedData?.phaseName && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Phase</span>
                </div>
                <div className="font-semibold">{processedData.phaseName}</div>
              </div>
            )}

            {/* Extracted Data Section */}
            {hasExtractedData ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Database size={20} className="text-primary" />
                  <h3 className="text-lg font-semibold">Extracted Data</h3>
                </div>
                
                <div className="border rounded-lg p-4 w-full min-w-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Data Key:</span>
                      <Badge variant="outline">{processedData?.extractedDataKey}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Data Type:</span>
                      <Badge variant="secondary">
                        {typeof processedData?.extractedData}
                      </Badge>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Code size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Data Content:</span>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto overflow-x-hidden w-full min-w-0">
                      <CodeDisplay 
                        data={processedData?.extractedData}
                        language={typeof processedData?.extractedData === 'string' ? 'text' : 'json'}
                      />
                    </div>
                  </div>

                  {/* Data Statistics */}
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground">Data Size</div>
                      <div className="font-semibold">
                        {typeof processedData?.extractedData === 'string' 
                          ? `${processedData.extractedData.length} characters`
                          : `${JSON.stringify(processedData?.extractedData).length} characters`
                        }
                      </div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground">Lines</div>
                      <div className="font-semibold">
                        {typeof processedData?.extractedData === 'string' 
                          ? processedData.extractedData.split('\n').length
                          : JSON.stringify(processedData?.extractedData, null, 2).split('\n').length
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center border rounded-lg">
                <Database size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Extracted Data</h3>
                <p className="text-muted-foreground">
                  This node hasn't extracted any data yet. Run the workflow to see extracted data here.
                </p>
              </div>
            )}

            {/* Node Inputs */}
            {processedData?.inputs && Object.keys(processedData.inputs).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Node Inputs</h3>
                <div className="border rounded-lg p-4 w-full min-w-0">
                  <CodeDisplay data={processedData.inputs} language="json" />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

NodeDataDetailsModal.displayName = "NodeDataDetailsModal";

export default NodeDataDetailsModal;
