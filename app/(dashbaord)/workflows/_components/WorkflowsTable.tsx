"use client";

import { Workflow } from "@prisma/client";
import { WorkflowStatus, WorkflowExecutionStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, FileText, Play, Clock, AlertTriangle, CheckCircle, CornerDownRight, MoveRight, Coins } from "lucide-react";
import { IconPlayerPlay, IconEdit, IconDots } from "@tabler/icons-react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import WorkflowActions from "./WorkflowActions";
import RunButton from "./RunButton";
import SchedulerDialog from "./SchedulerDialog";
import TooltipWrapper from "@/components/TooltipWrapper";

interface WorkflowsTableProps {
  workflows: Workflow[];
}

// Available tags for random selection
const availableTags = [
  "B2B", "B2C", "Technology", "Automation", "SaaS", "Information", 
  "Marketing", "Sales", "Analytics", "Data", "AI", "Machine Learning",
  "Web Scraping", "E-commerce", "Finance", "Healthcare", "Education",
  "Real Estate", "Travel", "Food", "Fashion", "Sports", "Entertainment"
];

// Tag color schemes similar to status badges
const tagColorSchemes = [
  {
    bg: "bg-[#373313] dark:bg-[#373313]",
    text: "text-[#F5E242] dark:text-[#F5E242]",
    shadow: "shadow-[#423e17_0px_0px_0px_1px_inset] dark:shadow-[#423e17_0px_0px_0px_1px_inset]"
  },
  {
    bg: "bg-[#1d4034] dark:bg-[#1d4034]",
    text: "text-[#a7f2cf] dark:text-[#a7f2cf]",
    shadow: "shadow-[#234a3a_0px_0px_0px_1px_inset] dark:shadow-[#234a3a_0px_0px_0px_1px_inset]"
  },
  {
    bg: "bg-[#4E1B28] dark:bg-[#4E1B28]",
    text: "text-[#FFD1D1] dark:text-[#FFD1D1]",
    shadow: "shadow-[#692623_0px_0px_0px_1px_inset] dark:shadow-[#692623_0px_0px_0px_1px_inset]"
  },
  {
    bg: "bg-[#2a2a2a] dark:bg-[#2a2a2a]",
    text: "text-[#cccccc] dark:text-[#cccccc]",
    shadow: "shadow-[#1a1a1a_0px_0px_0px_1px_inset] dark:shadow-[#1a1a1a_0px_0px_0px_1px_inset]"
  },
  {
    bg: "bg-[#1a2a3a] dark:bg-[#1a2a3a]",
    text: "text-[#87ceeb] dark:text-[#87ceeb]",
    shadow: "shadow-[#1a2a3a_0px_0px_0px_1px_inset] dark:shadow-[#1a2a3a_0px_0px_0px_1px_inset]"
  },
  {
    bg: "bg-[#3a1a2a] dark:bg-[#3a1a2a]",
    text: "text-[#dda0dd] dark:text-[#dda0dd]",
    shadow: "shadow-[#3a1a2a_0px_0px_0px_1px_inset] dark:shadow-[#3a1a2a_0px_0px_0px_1px_inset]"
  }
];

// Function to generate random tags for a workflow
const generateRandomTags = (workflowId: string) => {
  // Use workflow ID to ensure consistent tags for the same workflow
  const seed = workflowId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (seed * 9301 + 49297) % 233280;
  
  // Generate 2-5 random tags
  const numTags = (random % 4) + 2;
  const shuffled = [...availableTags].sort(() => 0.5 - Math.random());
  
  return shuffled.slice(0, numTags);
};

// Function to get random color scheme for a tag
const getRandomTagColor = (tagIndex: number, workflowId: string) => {
  const seed = workflowId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + tagIndex;
  const random = (seed * 9301 + 49297) % 233280;
  return tagColorSchemes[random % tagColorSchemes.length];
};

export default function WorkflowsTable({ workflows }: WorkflowsTableProps) {
  return (
    <div className="rounded-lg border border-[#27282b] dark:border-[#27282b] border-border bg-[#1a1d21] dark:bg-[#1a1d21] bg-card overflow-hidden">
      <div className="overflow-x-auto scrollbar-none">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-[#27282b] dark:border-[#27282b] border-border bg-[#1a1d21] dark:bg-[#1a1d21] bg-muted/50 hover:bg-[#1a1d21] dark:hover:bg-[#1a1d21] hover:bg-muted/50">
              <TableHead className="h-[40px] px-4 text-[14px] font-medium text-black dark:text-white min-w-[250px] bg-[#1a1d21] dark:bg-[#1a1d21] bg-muted/50 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border sticky left-0 z-10">
                <div className="flex items-center gap-2">
                  <Checkbox className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 border-[#2f3033] dark:border-[#2f3033] border-muted-foreground/30" />
                  <span>Name</span>
                </div>
              </TableHead>
              <TableHead className="h-[40px] px-4 text-[14px] font-medium text-black dark:text-white min-w-[150px] bg-[#1a1d21] dark:bg-[#1a1d21] bg-muted/50 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border">Description</TableHead>
              <TableHead className="h-[40px] px-4 text-[14px] font-medium text-black dark:text-white w-[250px] bg-[#1a1d21] dark:bg-[#1a1d21] bg-muted/50 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border">Tags</TableHead>
              <TableHead className="h-[40px] px-4 text-[14px] font-medium text-black dark:text-white min-w-[100px] bg-[#1a1d21] dark:bg-[#1a1d21] bg-muted/50 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border">Status</TableHead>
              <TableHead className="h-[40px] px-4 text-[14px] font-medium text-black dark:text-white min-w-[120px] bg-[#1a1d21] dark:bg-[#1a1d21] bg-muted/50 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border">Schedule</TableHead>
              <TableHead className="h-[40px] px-4 text-[14px] font-medium text-black dark:text-white min-w-[120px] bg-[#1a1d21] dark:bg-[#1a1d21] bg-muted/50 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border">Task Status</TableHead>
              <TableHead className="h-[40px] px-4 text-[14px] font-medium text-black dark:text-white min-w-[100px] bg-[#1a1d21] dark:bg-[#1a1d21] bg-muted/50 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border">Last Run</TableHead>
              <TableHead className="h-[40px] px-4 text-[14px] font-medium text-black dark:text-white min-w-[80px] bg-[#1a1d21] dark:bg-[#1a1d21] bg-muted/50 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border">Credits</TableHead>
              <TableHead className="h-[40px] px-4 text-[14px] font-medium text-black dark:text-white min-w-[100px] bg-[#1a1d21] dark:bg-[#1a1d21] bg-muted/50 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border">Created</TableHead>
              <TableHead className="text-right h-[40px] px-4 text-[14px] font-medium text-black dark:text-white min-w-[120px] bg-[#1a1d21] dark:bg-[#1a1d21] bg-muted/50 border-b border-[#27282b] dark:border-[#27282b] border-border">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.length === 0 ? (
              <TableRow className="h-12 bg-[#1a1d21] dark:bg-[#1a1d21] bg-background hover:bg-[#1a1d21] dark:hover:bg-[#1a1d21] hover:bg-muted/50 border-b border-[#27282b] dark:border-[#27282b] border-border">
                <TableCell colSpan={10} className="h-10 py-1 px-4 bg-[#1a1d21] dark:bg-[#1a1d21] bg-background border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border text-center">
                  <span className="text-[14px] text-[#eef1f5] dark:text-[#eef1f5] text-muted-foreground">No workflows found</span>
                </TableCell>
              </TableRow>
            ) : (
              workflows.map((workflow, index) => {
                const isDraft = workflow.status === WorkflowStatus.DRAFT;
                const hasName = workflow.name && workflow.name.trim() !== '';
                const hasDescription = workflow.description && workflow.description.trim() !== '';
                const hasLastRun = workflow.lastRunAt;
                const hasCredits = workflow.creditsCost !== null && workflow.creditsCost !== undefined;
                const tags = generateRandomTags(workflow.id);
                
                return (
                  <TableRow key={workflow.id} className="h-10 bg-[#1a1d21] dark:bg-[#1a1d21] bg-background hover:bg-[#1a1d21] dark:hover:bg-[#1a1d21] hover:bg-muted/50 border-b border-[#27282b] dark:border-[#27282b] border-border">
                    <TableCell className="h-10 py-1 px-4 bg-[#1a1d21] dark:bg-[#1a1d21] bg-muted/30 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border sticky left-0 z-10">
                      <div className="flex items-center gap-2">
                        <Checkbox className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 border-[#2f3033] dark:border-[#2f3033] border-muted-foreground/30" />
                        <Link 
                          href={`/workflow/editor/${workflow.id}`}
                          className="hover:underline text-black dark:text-[#eef1f5] text-[14px] font-medium truncate max-w-[160px] block"
                          title={workflow.name || "Untitled Workflow"}
                        >
                          {workflow.name || "Untitled Workflow"}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="h-10 py-2 bg-[#22222f] dark:bg-[#22222f] max-w-[250px] bg-muted/20 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border">
                      <div className="w-full overflow-hidden">
                        <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1 max-w-full">
                          {tags.map((tag, tagIndex) => {
                            const colorScheme = getRandomTagColor(tagIndex, workflow.id);
                            return (
                              <div
                                key={tagIndex}
                                className={`inline-flex items-center rounded-md h-[22px] gap-0 px-1  text-[14px] ${colorScheme.bg} ${colorScheme.text} ${colorScheme.shadow} whitespace-nowrap flex-shrink-0`}
                              >
                                <span className="text-[14px] py-2">{tag}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className={`h-10 py-1 px-4 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border ${hasDescription ? 'bg-[#22222f] dark:bg-[#22222f] bg-muted/20' : 'bg-[#1a1d21] dark:bg-[#1a1d21] bg-muted/30'}`}>
                      <span className={`text-[14px] ${hasDescription ? 'text-black dark:text-[#eef1f5]' : 'text-muted-foreground dark:text-[#ffffff4a]'} truncate block max-w-[130px]`} title={workflow.description || "No description"}>
                        {workflow.description || "No description"}
                      </span>
                    </TableCell>
                  
                    <TableCell className="h-10 py-1 px-4 bg-[#22222f] dark:bg-[#22222f] bg-muted/20 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border">
                      <div 
                        className={`inline-flex items-center rounded-2xl h-[22px] px-3 gap-1 text-[14px] ${
                          isDraft 
                            ? "bg-[#373313] dark:bg-[#373313] bg-amber-100 text-[#F5E242] dark:text-[#F5E242] text-amber-700 shadow-[#423e17_0px_0px_0px_1px_inset] dark:shadow-[#423e17_0px_0px_0px_1px_inset] shadow-amber-200/50" 
                            : "bg-[#1d4034] dark:bg-[#1d4034] bg-emerald-100 text-[#a7f2cf] dark:text-[#a7f2cf] text-emerald-700 shadow-[#234a3a_0px_0px_0px_1px_inset] dark:shadow-[#234a3a_0px_0px_0px_1px_inset] shadow-emerald-200/50"
                        }`}
                      >
                        <span>{isDraft ? "Draft" : "Published"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="h-10 py-1 px-4 bg-[#22222f] dark:bg-[#22222f] bg-muted/20 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border">
                      {!isDraft ? (
                        <div className="flex items-center gap-2">
                          <CornerDownRight className="h-4 w-4 text-[#F5E242]" />
                          <SchedulerDialog
                            workflowId={workflow.id}
                            workflowCron={workflow.cron}
                            key={`${workflow.cron}-${workflow.id}`}
                          />
                          <MoveRight className="h-4 w-4 text-[#F5E242]" />
                          <TooltipWrapper content="Credits consumption for full run">
                            <div className="flex items-center gap-1 text-black dark:text-[#eef1f5] text-[12px]">
                              <Coins className="h-3 w-3" />
                              <span>{workflow.creditsCost}</span>
                            </div>
                          </TooltipWrapper>
                        </div>
                      ) : (
                        <span className="text-[14px] text-[#ffffff4a] dark:text-[#ffffff4a] text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="h-10 py-1 px-4 bg-[#22222f] dark:bg-[#22222f] bg-muted/20 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border">
                      {!isDraft && workflow.lastRunStatus ? (
                        <div className="flex items-center gap-2">
                          {workflow.lastRunStatus === WorkflowExecutionStatus.RUNNING && (
                            <div className="inline-flex items-center rounded-2xl h-[22px] px-3 gap-2 text-[14px] bg-[#373313] dark:bg-[#373313] bg-amber-100 text-[#F5E242] dark:text-[#F5E242] text-amber-700 shadow-[#423e17_0px_0px_0px_1px_inset] dark:shadow-[#423e17_0px_0px_0px_1px_inset] shadow-amber-200/50">
                              <div className="w-2 h-2 bg-[#F5E242] dark:bg-[#F5E242] bg-amber-600 rounded-full animate-pulse"></div>
                              <span>Running</span>
                            </div>
                          )}
                          {workflow.lastRunStatus === WorkflowExecutionStatus.FAILED && (
                            <div className="inline-flex items-center rounded-2xl h-[22px] px-3 gap-2 text-[14px] bg-[#4E1B28] dark:bg-[#4E1B28] bg-red-100 text-[#FFD1D1] dark:text-[#FFD1D1] text-red-700 shadow-[#692623_0px_0px_0px_1px_inset] dark:shadow-[#692623_0px_0px_0px_1px_inset] shadow-red-200/50">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Failed</span>
                          </div>
                        )}
                        {workflow.lastRunStatus === WorkflowExecutionStatus.COMPLETED && (
                          <div className="inline-flex items-center rounded-2xl h-[22px] px-3 gap-2 text-[14px] bg-[#1d4034] dark:bg-[#1d4034] bg-emerald-100 text-[#a7f2cf] dark:text-[#a7f2cf] text-emerald-700 shadow-[#234a3a_0px_0px_0px_1px_inset] dark:shadow-[#234a3a_0px_0px_0px_1px_inset] shadow-emerald-200/50">
                            <CheckCircle className="h-3 w-3" />
                            <span>Completed</span>
                          </div>
                        )}
                        {workflow.lastRunStatus === WorkflowExecutionStatus.PENDING && (
                          <div className="inline-flex items-center rounded-2xl h-[22px] px-3 gap-2 text-[14px] bg-[#2a2a2a] dark:bg-[#2a2a2a] bg-slate-100 text-[#cccccc] dark:text-[#cccccc] text-slate-700 shadow-[#1a1a1a_0px_0px_0px_1px_inset] dark:shadow-[#1a1a1a_0px_0px_0px_1px_inset] shadow-slate-200/50">
                            <Clock className="h-3 w-3" />
                            <span>Pending</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-[14px] text-[#ffffff4a] dark:text-[#ffffff4a] text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className={`h-10 py-1 px-4 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border ${hasLastRun ? 'bg-[#22222f] dark:bg-[#22222f] bg-muted/20' : 'bg-[#1a1d21] dark:bg-[#1a1d21] bg-muted/30'}`}>
                    {workflow.lastRunAt ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] text-black dark:text-[#eef1f5] truncate block max-w-[80px]" title={formatDistanceToNow(workflow.lastRunAt, { addSuffix: true })}>
                          {formatDistanceToNow(workflow.lastRunAt, { addSuffix: true })}
                        </span>
                        {workflow.nextRunAt && (
                          <div className="flex items-center gap-1 text-[12px] text-[#F5E242]">
                            <Clock className="h-3 w-3" />
                            <span>Next: {format(workflow.nextRunAt, "HH:mm")}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-[14px] text-[#ffffff4a] dark:text-[#ffffff4a] text-muted-foreground">Never</span>
                    )}
                  </TableCell>
                  <TableCell className={`h-10 py-1 px-4 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border ${hasCredits ? 'bg-[#22222f] dark:bg-[#22222f] bg-muted/20' : 'bg-[#1a1d21] dark:bg-[#1a1d21] bg-muted/30'}`}>
                    <span className={`text-[14px] font-mono ${hasCredits ? 'text-black dark:text-[#eef1f5]' : 'text-muted-foreground dark:text-[#ffffff4a]'}`}>
                      {workflow.creditsCost || 0}
                    </span>
                  </TableCell>
                  <TableCell className="h-10 py-1 px-4 bg-[#22222f] dark:bg-[#22222f] bg-muted/20 border-r border-[#27282b] dark:border-[#27282b] border-border border-b border-[#27282b] dark:border-[#27282b] border-border">
                    <span className="text-[14px] text-black dark:text-[#eef1f5] truncate block max-w-[80px]" title={formatDistanceToNow(workflow.createdAt, { addSuffix: true })}>
                      {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
                    </span>
                  </TableCell>
                  <TableCell className="h-10 py-1 px-4 text-right bg-[#22222f] dark:bg-[#22222f] bg-muted/20 border-b border-[#27282b] dark:border-[#27282b] border-border">
                    <div className="flex items-center justify-end gap-2 min-w-[120px]">
                      {!isDraft && (
                        <RunButton workflowId={workflow.id} />
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 w-8 p-0 hover:bg-[#1a1d21] dark:hover:bg-[#1a1d21] hover:bg-muted/50 hover:text-[#a7f2cf] dark:hover:text-[#a7f2cf] hover:text-foreground text-[#eef1f5] dark:text-[#eef1f5] text-muted-foreground"
                      >
                        <Link href={`/workflow/editor/${workflow.id}`}>
                          <IconEdit className="h-4 w-4" />
                        </Link>
                      </Button>

                      <WorkflowActions
                        workflowName={workflow.name}
                        workflowId={workflow.id}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  </div>
  );
}
