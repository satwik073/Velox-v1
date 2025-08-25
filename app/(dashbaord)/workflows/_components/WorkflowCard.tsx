"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WorkflowExecutionStatus, WorkflowStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Workflow } from "@prisma/client";
import {
  ChevronRightIcon,
  ClockIcon,
  CoinsIcon,
  CornerDownRightIcon,
  FileTextIcon,
  MoveRightIcon,
  PlayIcon,
  ShuffleIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import WorkflowActions from "./WorkflowActions";
import RunButton from "./RunButton";
import SchedulerDialog from "./SchedulerDialog";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Badge } from "@/components/ui/badge";
import ExecutionStatusIndicator, {
  ExecutionStatusLabel,
} from "@/app/workflow/runs/[workflowId]/_components/ExecutionStatusIndicator";
import { format, formatDistanceToNow } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import DuplicateWorkflowDialog from "./DuplicateWorkflowDialog";

const statusColor = {
  [WorkflowStatus.DRAFT]: "bg-yellow-400 text-yellow-600",
  [WorkflowStatus.PUBLISHED]: "bg-primary",
};

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  return (
    <Card className="border border-border/50 bg-card  rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-200 group/card">
      <CardContent className="p-5 flex items-center justify-between h-[110px]">
        <div className="flex items-center space-x-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center  transition-all duration-200",
              isDraft 
                ? "bg-amber-50 text-amber-600 border border-amber-200" 
                : "bg-primary/10 text-primary border border-primary/20"
            )}
          >
            {isDraft ? (
              <FileTextIcon className="h-6 w-6" />
            ) : (
              <PlayIcon className="h-6 w-6" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground flex items-center mb-1">
              <TooltipWrapper content={workflow.description!}>
                <Link 
                  href={`/workflow/editor/${workflow.id}`}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {workflow.name}
                </Link>
              </TooltipWrapper>
              {isDraft && (
                <Badge variant="secondary" className="ml-2 bg-amber-50 text-amber-700 border-amber-200 text-xs">
                  Draft
                </Badge>
              )}
              <DuplicateWorkflowDialog
                workflowId={workflow.id}
                name={workflow.name}
                description={workflow.description || ""}
              />
            </h3>
            <SchedulerSection
              isDraft={isDraft}
              creditsCost={workflow.creditsCost}
              workflowId={workflow.id}
              workflowCron={workflow.cron}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && <RunButton workflowId={workflow.id} />}
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "flex items-center px-3 py-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
            )}
          >
            <ShuffleIcon size={16} className="mr-2" />
            Edit
          </Link>
          <WorkflowActions
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
      <LastRunDetails workflow={workflow} />
    </Card>
  );
}

export default WorkflowCard;

function SchedulerSection({
  isDraft,
  creditsCost,
  workflowId,
  workflowCron,
}: {
  isDraft: boolean;
  creditsCost: number;
  workflowId: string;
  workflowCron: string | null;
}) {
  if (isDraft) return null;
  return (
    <div className="flex items-center gap-3">
      <CornerDownRightIcon className="h-4 w-4 text-muted-foreground" />
      <SchedulerDialog
        workflowId={workflowId}
        workflowCron={workflowCron}
        // forcing rerender of dialog using key
        key={`${workflowCron}-${workflowId}`}
      />
      <MoveRightIcon className="h-4 w-4 text-muted-foreground" />
      <TooltipWrapper content="Credits consumption for full run">
        <Badge
          variant={"outline"}
          className="bg-muted/50 border-border/50 text-muted-foreground rounded-md px-2 py-1"
        >
          <CoinsIcon className="h-3 w-3 mr-1.5" />
          <span className="text-xs font-medium">{creditsCost}</span>
        </Badge>
      </TooltipWrapper>
    </div>
  );
}

function LastRunDetails({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;

  if (isDraft) return null;

  const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;
  const formattedStartedAt =
    lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });

  const nextSchedule = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm");
  const nextScheduleUtc =
    nextRunAt && formatInTimeZone(nextRunAt, "UTC", "HH:mm");

  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-5 py-2 border-t border-border/50">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          {lastRunAt ? (
            <Link
              href={`/workflow/runs/${workflow.id}/${lastRunId}`}
              className="flex items-center gap-2 group hover:text-primary transition-colors duration-200"
            >
              <span className="text-muted-foreground">Last run:</span>
              <ExecutionStatusIndicator
                status={lastRunStatus as WorkflowExecutionStatus}
              />
              <ExecutionStatusLabel
                status={lastRunStatus as WorkflowExecutionStatus}
              />
              <span className="font-medium">{formattedStartedAt}</span>
              <ChevronRightIcon
                size={14}
                className="text-muted-foreground group-hover:text-primary -translate-x-[2px] group-hover:translate-x-0 transition-all duration-200"
              />
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>No runs yet</span>
            </div>
          )}
        </div>
        
        {nextRunAt && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <ClockIcon size={14} />
            <span>Next:</span>
            <span className="font-medium">{nextSchedule}</span>
            <span className="text-xs opacity-75">({nextScheduleUtc} UTC)</span>
          </div>
        )}
      </div>
    </div>
  );
}
