import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { Navigation, LucideProps } from "lucide-react";

export const NavigateUrlTask = {
  type: TaskType.NAVIGATE_URL,
  label: "Navigate Url",
  icon: (props: LucideProps) => (
    <Navigation className="stroke-blue-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: TaskParamType.BROWSE_INSTANCE,
      required: true,
    },
    {
      name: "Url",
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
  credits: 2,
} satisfies WorkflowTask;
