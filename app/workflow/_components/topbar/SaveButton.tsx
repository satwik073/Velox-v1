"use client";

import { updateWorkFlow } from "@/actions/workflows";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function SaveButton({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();

  const saveMutation = useMutation({
    mutationFn: updateWorkFlow,
    onSuccess: () => {
      toast.success("Flow saved successfully", { id: "save-workflow" });
    },
    onError: () => {
      toast.error("Somwthing went wrong", { id: "save-workflow" });
    },
  });

  return (
    <Button
      className="bg-[#266DF0] border-[1.5px] border-[#407bf2] text-[14px] font-normal py-2 px-4 h-[28px] rounded-[8px] flex items-center gap-2"
      style={{padding: '4px 8px 4px 6px'}}
      onClick={() => {
        const workflowDef = JSON.stringify(toObject());
        toast.loading("Saving Workflow", { id: "save-workflow" });
        saveMutation.mutate({
          id: workflowId,
          definition: workflowDef,
        });
      }}
      disabled={saveMutation.isPending}
    >
      <CheckIcon size={16} className="stroke-white" />
      Save
    </Button>
  );
}

export default SaveButton;
