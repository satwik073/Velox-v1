"use client";
import { runWorkflow } from "@/actions/runWorkflow";
import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/hooks/useExecutionPlan";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function ExecuteButton({ workflowId }: { workflowId: string }) {
  const generateExecutionPlan = useExecutionPlan();
  const mutation = useMutation({
    mutationFn: runWorkflow,
    onSuccess: () => {
      toast.success("Execution Started", { id: "flow-execution" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "flow-execution" });
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
        toast.success("Starting execution...", { id: "flow-execution" });
        mutation.mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <PlayIcon size={16} className="stroke-white" /> Execute
    </Button>
  );
}

export default ExecuteButton;
