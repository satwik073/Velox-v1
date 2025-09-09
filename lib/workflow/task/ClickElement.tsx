import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { LucideProps, MousePointer } from "lucide-react";

export const ClickElementTask = {
  type: TaskType.CLICK_ELEMENT,
  label: "Click Element",
  icon: (props: LucideProps) => (
    <MousePointer className="stroke-purple-400" {...props} />
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
  ] as const,
  outputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSE_INSTANCE,
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
