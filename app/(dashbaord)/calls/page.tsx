import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Phone, PhoneCall, PhoneOff, Clock } from "lucide-react";

export default function CallsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Calls</h1>
        </div>
       
      </div>
    </div>
  );
}
