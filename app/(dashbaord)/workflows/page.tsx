export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { Suspense } from "react";
import UserWorkflowSkeleton from "./_components/UserWorkflowSkeleton";
import UserWorkflows from "./_components/UserWorkflows";
import CreateWorkflowDialog from "./_components/CreateWorkflowDialog";
import { IconPlus, IconTemplate } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

function page() {
  // Skip during production build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between px-[2rem]">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <div className="flex gap-2">

        <Button className="bg-[#1A1D21] border-[1px] border-[#2f3033] text-[14px] font-normal py-2 px-4 h-[29px] hover: rounded-[8px]" style={{padding: '4px 8px 4px 6px', boxShadow:'inset 0px 0px 0px 1px #2F3033,0px 0px 2px 0px rgb(0, 0, 0),0px 1px 3px 0px rgba(0, 0, 0, 0.08)'}}>
          <IconTemplate/>
          View settings
        </Button>
        <CreateWorkflowDialog />
        </div>
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
}

export default page;
