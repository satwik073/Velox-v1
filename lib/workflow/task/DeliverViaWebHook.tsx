import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { LucideProps, Zap } from "lucide-react";

export const DeliverViaWebHookTask = {
  type: TaskType.DELIVER_VIA_WEBHOOK,
  label: "Deliver via Webhook",
  icon: (props: LucideProps) => (
    <Zap className="stroke-red-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Body",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Target url",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [] as const,
  credits: 1,
} satisfies WorkflowTask;
