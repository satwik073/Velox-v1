"use client";

import { Workflow } from "@prisma/client";
import { WorkflowStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, FileText, Play } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import WorkflowActions from "./WorkflowActions";
import RunButton from "./RunButton";

interface WorkflowsTableProps {
  workflows: Workflow[];
}

export default function WorkflowsTable({ workflows }: WorkflowsTableProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b dark:bg-[#1b1d21]">
              <TableHead className="h-8 text-xs font-medium text-muted-foreground min-w-[120px]">Name</TableHead>
              <TableHead className="h-8 text-xs font-medium text-muted-foreground min-w-[150px]">Description</TableHead>
              <TableHead className="h-8 text-xs font-medium text-muted-foreground min-w-[100px]">Status</TableHead>
              <TableHead className="h-8 text-xs font-medium text-muted-foreground min-w-[100px]">Last Run</TableHead>
              <TableHead className="h-8 text-xs font-medium text-muted-foreground min-w-[80px]">Credits</TableHead>
              <TableHead className="h-8 text-xs font-medium text-muted-foreground min-w-[100px]">Created</TableHead>
              <TableHead className="text-right h-8 text-xs font-medium text-muted-foreground min-w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          {workflows.map((workflow, index) => {
            const isDraft = workflow.status === WorkflowStatus.DRAFT;
            
            return (
              <TableRow key={workflow.id} className="h-10 dark:bg-[#1b1d21]">
                <TableCell className="h-10 py-1">
                  <div className="flex items-center gap-2">
                    {/* <div className="w-3 h-3 rounded-full bg-primary"></div> */}
                    <Link 
                      href={`/workflow/editor/${workflow.id}`}
                      className="hover:underline text-primary text-sm"
                    >
                      {workflow.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="h-10 py-1">
                  <span className="text-sm text-muted-foreground">
                    {workflow.description || "No description"}
                  </span>
                </TableCell>
                <TableCell className="h-10 py-1">
                  <Badge 
                    variant="secondary" 
                    className={`h-4 text-xs ${isDraft ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                  >
                    {isDraft ? <FileText className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                    {isDraft ? "Draft" : "Published"}
                  </Badge>
                </TableCell>
                <TableCell className="h-10 py-1">
                  {workflow.lastRunAt ? (
                    <span className="text-sm">
                      {formatDistanceToNow(workflow.lastRunAt, { addSuffix: true })}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">Never</span>
                  )}
                </TableCell>
                <TableCell className="h-10 py-1">
                  <span className="text-sm font-mono">{workflow.creditsCost}</span>
                </TableCell>
                <TableCell className="h-10 py-1">
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
                  </span>
                </TableCell>
                <TableCell className="h-10 py-1 text-right">
                  <div className="flex items-center justify-end gap-1 min-w-[100px]">
                    {!isDraft && <RunButton workflowId={workflow.id} />}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-6 px-2"
                    >
                      <Link href={`/workflow/editor/${workflow.id}`}>
                        <Edit className="h-3 w-3" />
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
          })}
        </TableBody>
      </Table>
    </div>
  </div>
  );
}
