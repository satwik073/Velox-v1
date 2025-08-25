export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Notes</h1>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>
    
    </div>
  );
}
