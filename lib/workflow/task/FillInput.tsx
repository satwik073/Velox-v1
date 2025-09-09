import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { Type, LucideProps } from "lucide-react";

export const FillInputTask = {
  type: TaskType.FILL_INPUT,
  label: "Fill Input",
  icon: (props: LucideProps) => (
    <Type className="stroke-green-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSE_INSTANCE,
      required: true,
    },
    {
      name: "Selector",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Value",
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSE_INSTANCE,
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
