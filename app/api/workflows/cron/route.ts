import { getAppUrl } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/lib/types";
import { NextRequest } from "next/server";

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
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

    for (const workflow of workflows) {
      await triggerWorkflow(workflow.id);
    }

    return Response.json({ workflowsToRun: workflows.length }, { status: 200 });
  } catch (error) {
    console.error("Error in cron job:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function triggerWorkflow(workflowId: string) {
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
}
