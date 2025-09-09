import { TaskParamType, TaskType, WorkflowTask } from "@/lib/types";
import { Sparkles, LucideProps } from "lucide-react";

export const ExtractDataWithAiTask = {
  type: TaskType.EXTRACT_DATA_WITH_AI,
  label: "Extract data with AI",
  icon: (props: LucideProps) => (
    <Sparkles className="stroke-yellow-400" {...props} />
  ),
  isEntryPoint: false,
  credits: 3,
  inputs: [
    {
      name: "Content",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
    {
      name: "Prompt",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
  ] as const,
  outputs: [
    {
      name: "Extracted Data",
      type: TaskParamType.STRING,
    },
  ] as const,
} satisfies WorkflowTask;
