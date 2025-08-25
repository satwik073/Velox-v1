export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, TrendingUp, TrendingDown, Calendar } from "lucide-react";

export default function ReportsPage() {
  // Skip during production build
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Reports</h1>
        </div>
      </div>
      
    </div>
  );
}
