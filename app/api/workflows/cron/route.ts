import { NextRequest } from "next/server";

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  // Always return success during build to prevent data collection
  if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production') {
    return Response.json({ skipped: true, message: "Build phase - skipping execution" }, { status: 200 });
  }
  
  // Only run actual logic in development or when explicitly called
  try {
    // Dynamic imports to avoid build-time evaluation
    const { getAppUrl } = await import("@/lib/helper");
    const prisma = (await import("@/lib/prisma")).default;
    const { WorkflowStatus } = await import("@/lib/types");
    
    const now = new Date();

    const workflows = await prisma.workflow.findMany({
      select: {
        id: true,
      },
      where: {
        status: WorkflowStatus.PUBLISHED,
        cron: { not: null },
        nextRunAt: {
          lte: now,
        },
      },
    });

    // Helper function inside main function to access dynamic imports
    const triggerWorkflow = async (workflowId: string) => {
      try {
        const apiSecret = process.env.API_SECRET;
        if (!apiSecret) {
          console.error("API_SECRET is not configured");
          return;
        }

        const triggerApiUrl = getAppUrl(`api/workflows/execute?workflowId=${workflowId}`);
        
        const response = await fetch(triggerApiUrl, {
          headers: {
            Authorization: `Bearer ${apiSecret}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error: any) {
        console.error(
          "Error triggering workflow with id",
          workflowId,
          ":error->",
          error.message
        );
      }
    };

    for (const workflow of workflows) {
      await triggerWorkflow(workflow.id);
    }

    return Response.json({ workflowsToRun: workflows.length }, { status: 200 });
  } catch (error) {
    console.error("Error in cron job:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
