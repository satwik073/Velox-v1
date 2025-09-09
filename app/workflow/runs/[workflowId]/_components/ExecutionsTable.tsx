"use client";
import { getWorkflowExecutions } from "@/actions/workflows";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { datesToDurationString } from "@/lib/helper";
import { Badge } from "@/components/ui/badge";
import ExecutionStatusIndicator from "./ExecutionStatusIndicator";
import { WorkflowExecutionStatus } from "@/lib/types";
import { Coins, CoinsIcon, Loader2Icon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { getWorkflowExecutionWithPhases } from "@/actions/workflows";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PhaseStatusBadge from "../[executionId]/_components/PhaseStatusBadge";

type InitialData = Awaited<ReturnType<typeof getWorkflowExecutions>>;

function ExecutionsTable({
  workflowId,
  initialData,
}: {
  workflowId: string;
  initialData: InitialData;
}) {
  const query = useQuery({
    queryKey: ["executions", workflowId],
    initialData,
    queryFn: () => getWorkflowExecutions(workflowId),
    refetchInterval: 5000,
  });

  const router = useRouter();

  return (
    <div className="border rounded-lg shadow-md overflow-auto ">
      <Table className="h-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Extracted Data</TableHead>
            <TableHead>Consumed</TableHead>
            <TableHead className="text-right text-sm text-muted-foreground">
              Started at
            </TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="gap-2 h-full overflow-auto">
          {query.data.map((execution) => {
            const duration = datesToDurationString(
              execution.completedAt,
              execution.startedAt
            );

            const formattedStartedAt =
              execution.startedAt &&
              formatDistanceToNow(execution.startedAt, { addSuffix: true });

            return (
              <TableRow
                key={execution.id}
                className="cursor-pointer"
                onClick={() => {
                  router.push(
                    `/workflow/runs/${execution.workflowId}/${execution.id}`
                  );
                }}
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">{execution.id}</span>
                    <div className="text-muted-foreground text-xs flex gap-1 items-center">
                      <span className="">Triggered via</span>
                      <Badge variant={"outline"}>{execution.trigger}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <ExecutionStatusIndicator
                        status={execution.status as WorkflowExecutionStatus}
                      />
                      <span className="font-semibold capitalize">
                        {execution.status}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs mx-5">
                      {duration}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <ExtractedDataCell executionId={execution.id} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <CoinsIcon size={16} className="text-primary" />
                      <span className="font-semibold capitalize">
                        {execution.creditsConsumed}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs mx-5">
                      Credits
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground capitalize first:uppercase">
                  {formattedStartedAt}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex gap-2 justify-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Maximize2 size={14} className="mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle>Execution Details - {execution.id}</DialogTitle>
                        </DialogHeader>
                        <ExecutionDetailsModal executionId={execution.id} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function ExtractedDataCell({ executionId }: { executionId: string }) {
  const [showData, setShowData] = useState(false);
  const [extractedData, setExtractedData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchExtractedData = async () => {
    if (extractedData !== null) return; // Already fetched
    
    setLoading(true);
    try {
      const execution = await getWorkflowExecutionWithPhases(executionId);
      if (execution?.phases) {
        // Find the latest phase with extracted data
        const latestPhase = execution.phases
          .filter(phase => phase.outputs)
          .sort((a, b) => (b.completedAt || new Date(0)).getTime() - (a.completedAt || new Date(0)).getTime())[0];
        
        if (latestPhase?.outputs) {
          const outputs = JSON.parse(latestPhase.outputs);
          // Look for common extracted data keys
          const dataKeys = ['extractedData', 'data', 'result', 'content', 'text'];
          const foundData = dataKeys.find(key => outputs[key]);
          setExtractedData(foundData ? outputs[foundData] : null);
        }
      }
    } catch (error) {
      console.error('Error fetching extracted data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleData = () => {
    if (!showData && extractedData === null) {
      fetchExtractedData();
    }
    setShowData(!showData);
  };

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggleData}
        className="h-6 px-2 text-xs justify-start"
        disabled={loading}
      >
        {loading ? (
          <Loader2Icon size={12} className="animate-spin mr-1" />
        ) : showData ? (
          <EyeOff size={12} className="mr-1" />
        ) : (
          <Eye size={12} className="mr-1" />
        )}
        {showData ? 'Hide' : 'Show'} Data
      </Button>
      {showData && extractedData && (
        <div className="text-xs text-muted-foreground max-w-[200px] truncate">
          {extractedData.length > 50 
            ? `${extractedData.substring(0, 50)}...` 
            : extractedData}
        </div>
      )}
      {showData && !extractedData && !loading && (
        <div className="text-xs text-muted-foreground">
          No data extracted
        </div>
      )}
    </div>
  );
}

function ExecutionDetailsModal({ executionId }: { executionId: string }) {
  const [executionData, setExecutionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExecutionData = async () => {
      try {
        const data = await getWorkflowExecutionWithPhases(executionId);
        setExecutionData(data);
      } catch (error) {
        console.error('Error fetching execution data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExecutionData();
  }, [executionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2Icon size={24} className="animate-spin" />
      </div>
    );
  }

  if (!executionData) {
    return <div>No execution data found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Execution Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Status</div>
          <div className="font-semibold capitalize">{executionData.status}</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Credits Consumed</div>
          <div className="font-semibold">{executionData.creditsConsumed}</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Duration</div>
          <div className="font-semibold">
            {datesToDurationString(executionData.completedAt, executionData.startedAt) || '-'}
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Triggered Via</div>
          <div className="font-semibold capitalize">{executionData.trigger}</div>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Execution Phases</h3>
        {executionData.phases?.map((phase: any, index: number) => (
          <div key={phase.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{index + 1}</Badge>
                <span className="font-semibold">{phase.name}</span>
              </div>
              <PhaseStatusBadge status={phase.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-sm text-muted-foreground">Credits</div>
                <div className="font-semibold">{phase.creditsConsumed}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="font-semibold">
                  {datesToDurationString(phase.completedAt, phase.startedAt) || '-'}
                </div>
              </div>
            </div>

            {/* Inputs */}
            {phase.inputs && (
              <div className="mb-3">
                <h4 className="text-sm font-semibold mb-2">Inputs</h4>
                <div className="bg-muted p-3 rounded text-sm">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(JSON.parse(phase.inputs), null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Outputs */}
            {phase.outputs && (
              <div className="mb-3">
                <h4 className="text-sm font-semibold mb-2">Outputs</h4>
                <div className="bg-muted p-3 rounded text-sm">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(JSON.parse(phase.outputs), null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Logs */}
            {phase.logs && phase.logs.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Logs</h4>
                <div className="space-y-1">
                  {phase.logs.map((log: any) => (
                    <div key={log.id} className="text-xs p-2 bg-muted rounded">
                      <span className="text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      <span className={`ml-2 font-semibold ${
                        log.logLevel === 'error' ? 'text-destructive' : 
                        log.logLevel === 'info' ? 'text-primary' : ''
                      }`}>
                        [{log.logLevel.toUpperCase()}]
                      </span>
                      <span className="ml-2">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExecutionsTable;
