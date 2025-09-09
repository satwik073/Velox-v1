"use client";

import { runWorkflow } from "@/actions/runWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { IconPlayerPlay } from "@tabler/icons-react";
import { toast } from "sonner";

function RunButton({ workflowId }: { workflowId: string }) {
  const mutation = useMutation({
    mutationFn: runWorkflow,
    onSuccess: () => {
      toast.success("Workflow started", { id: workflowId });
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong", { id: workflowId });
    },
  });

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 hover:bg-[#1a1d21] dark:hover:bg-[#1a1d21] hover:bg-muted/50 hover:text-[#F5E242] dark:hover:text-[#F5E242] hover:text-foreground text-[#eef1f5] dark:text-[#eef1f5] text-muted-foreground"
      onClick={() => {
        toast.success("Scheduling run...", { id: workflowId });
        mutation.mutate({
          workflowId,
        });
      }}
    >
      <IconPlayerPlay className="h-4 w-4" />
    </Button>
  );
}

export default RunButton;
