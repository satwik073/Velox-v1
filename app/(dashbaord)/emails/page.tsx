import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function EmailsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Emails</h1>
        </div>
   
      </div>
    </div>
  );
}
