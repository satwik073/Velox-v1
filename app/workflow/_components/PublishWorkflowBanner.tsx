"use client";

import { runWorkflow } from "@/actions/runWorkflow";
import { publishWorkflow } from "@/actions/workflows";
import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { UploadIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface PublishWorkflowBannerProps {
  workflowId: string;
  isPublished?: boolean;
}

function PublishWorkflowBanner({ workflowId, isPublished = false }: PublishWorkflowBannerProps) {
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

  // Don't show banner if already published
  if (isPublished) {
    return null;
  }

  return (
    <div className="bg-[#1d2e55] border border-[#2b3e6d] px-6 py-3 rounded-[8px] flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full bg-[#c2d6ff]/20 flex items-center justify-center">
          <span className="text-sm text-[#c2d6ff]">ⓘ</span>
        </div>
        <span className="text-[16px] font-normal text-[#c2d6ff]">This workflow has not yet been published</span>
      </div>
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
        <UploadIcon size={16} className="stroke-white" /> Publish workflow
      </Button>
    </div>
  );
}

export default PublishWorkflowBanner;
