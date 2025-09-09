import { getWorkflowExecutionWithPhases } from "@/actions/workflows";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { executionId: string } }
) {
  try {
    const execution = await getWorkflowExecutionWithPhases(params.executionId);
    
    if (!execution) {
      return NextResponse.json({ error: "Execution not found" }, { status: 404 });
    }

    return NextResponse.json(execution);
  } catch (error) {
    console.error("Error fetching execution:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
