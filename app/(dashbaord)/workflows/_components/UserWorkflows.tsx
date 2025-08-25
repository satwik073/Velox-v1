"use client";

import { getWorkflowsForUser } from "@/actions/workflows";
import React, { useState, useEffect } from "react";

import { AlertCircle, InboxIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CreateWorkflowDialog from "./CreateWorkflowDialog";
import WorkflowsTable from "./WorkflowsTable";
import WorkflowCard from "./WorkflowCard";
import ViewToggle from "./ViewToggle";
import { Workflow } from "@prisma/client";
import UserWorkflowSkeleton from "./UserWorkflowSkeleton";

function UserWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"table" | "card">("table");

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        const data = await getWorkflowsForUser();
        setWorkflows(data || []);
      } catch (err) {
        setError("Failed to fetch workflows");
      } finally {
        setLoading(false);
      }
    }
    fetchWorkflows();
  }, []);
  if (loading) {
    return <UserWorkflowSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col gap-4 h-full items-center">
        <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
          <InboxIcon size={40} className="stroke-primary" />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <p className="font-bold">No workflow created yet</p>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first workflow
          </p>
        </div>
        <CreateWorkflowDialog triggeredText="Create your first workflow" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      
      {view === "table" ? (
        <WorkflowsTable workflows={workflows} />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {workflows.map((workflow) => (
            <WorkflowCard workflow={workflow} key={workflow.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserWorkflows;
