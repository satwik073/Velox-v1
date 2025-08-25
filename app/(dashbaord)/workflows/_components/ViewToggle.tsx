"use client";

import { Button } from "@/components/ui/button";
import { Table, Grid3X3 } from "lucide-react";

interface ViewToggleProps {
  view: "table" | "card";
  onViewChange: (view: "table" | "card") => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-1 border rounded-md p-1">
      <Button
        variant={view === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("table")}
        className="h-8 w-8 p-0"
      >
        <Table className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "card" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("card")}
        className="h-8 w-8 p-0"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
    </div>
  );
}
