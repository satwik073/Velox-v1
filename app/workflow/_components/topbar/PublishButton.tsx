"use client";
import { runWorkflow } from "@/actions/runWorkflow";
import { publishWorkflow } from "@/actions/workflows";
import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon, UploadIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function PublishButton({ workflowId }: { workflowId: string }) {
  const generateExecutionPlan = useExecutionPlan();
  const mutation = useMutation({
    mutationFn: publishWorkflow,
    onSuccess: () => {
      toast.success("Workflow published", { id: workflowId });
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong", { id: workflowId });
    },
  });

  const { toObject } = useReactFlow();

  return (
    <Button
      className="bg-[#266DF0] border-[1.5px] border-[#407bf2] text-[14px] font-normal py-2 px-4 h-[28px] rounded-[8px] flex items-center gap-2"
      style={{padding: '4px 8px 4px 6px'}}
      disabled={mutation.isError}
      onClick={() => {
        const plan = generateExecutionPlan();
        if (!plan) return;
        toast.loading("Publishing workflow...", { id: workflowId });
        mutation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <UploadIcon size={16} className="stroke-white" /> Publish
    </Button>
  );
}

export default PublishButton;
