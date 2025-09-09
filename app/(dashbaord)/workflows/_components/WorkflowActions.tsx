import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDots, IconTrash } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import DeleteWorkflowDialog from "./DeleteWorkflowDialog";

function WorkflowActions({
  workflowName,
  workflowId,
}: {
  workflowName: string;
  workflowId: string;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <Fragment>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 hover:bg-[#1a1d21] dark:hover:bg-[#1a1d21] hover:bg-muted/50 hover:text-[#eef1f5] dark:hover:text-[#eef1f5] hover:text-foreground text-[#cccccc] dark:text-[#cccccc] text-muted-foreground"
          >
            <IconDots className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#1a1d21] dark:bg-[#1a1d21] bg-background border-[#27282b] dark:border-[#27282b] border-border">
          <DropdownMenuLabel className="text-[#eef1f5] dark:text-[#eef1f5] text-foreground">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#27282b] dark:bg-[#27282b] bg-border" />
          <DropdownMenuItem
            className="text-[#eef1f5] dark:text-[#eef1f5] text-foreground hover:bg-[#22222f] dark:hover:bg-[#22222f] hover:bg-muted/50 hover:text-[#eef1f5] dark:hover:text-[#eef1f5] hover:text-foreground flex items-center gap-2"
            onSelect={() => {
              setShowDeleteDialog((prev) => !prev);
            }}
          >
            <IconTrash size={18} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
}

export default WorkflowActions;
