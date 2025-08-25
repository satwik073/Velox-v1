"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

// Custom shimmer effect component
const ShimmerSkeleton = ({ className }: { className: string }) => (
  <div className={`shimmer rounded ${className}`} />
);

const ShimmerSkeletonPulse = ({ className }: { className: string }) => (
  <div className={`shimmer rounded animate-pulse ${className}`} />
);

function UserWorkflowSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}

      {/* Compact Table Skeleton */}
      {/* Compact Table Skeleton */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b dark:bg-[#1b1d21]">
                <TableHead className="h-8 text-xs font-medium text-muted-foreground min-w-[120px]">Name</TableHead>
                <TableHead className="h-8 text-xs font-medium text-muted-foreground min-w-[150px]">Description</TableHead>
                <TableHead className="h-8 text-xs font-medium text-muted-foreground min-w-[100px]">Status</TableHead>
                <TableHead className="h-8 text-xs font-medium text-muted-foreground min-w-[100px]">Last Run</TableHead>
                <TableHead className="h-8 text-xs font-medium text-muted-foreground min-w-[80px]">Credits</TableHead>
                <TableHead className="h-8 text-xs font-medium text-muted-foreground min-w-[100px]">Created</TableHead>
                <TableHead className="text-right h-8 text-xs font-medium text-muted-foreground min-w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 16 }).map((_, index) => (
                <TableRow key={index} className="h-10 dark:bg-[#1b1d21] animate-in fade-in duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                  <TableCell className="h-10 py-1">
                    <div className="flex items-center gap-2">
                      <ShimmerSkeletonPulse className="h-3 w-3 rounded-full" />
                      <ShimmerSkeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="h-10 py-1">
                    <ShimmerSkeletonPulse className="h-3 w-32" />
                  </TableCell>
                  <TableCell className="h-10 py-1">
                    <ShimmerSkeleton className="h-4 w-16 rounded-full" />
                  </TableCell>
                  <TableCell className="h-10 py-1">
                    <ShimmerSkeleton className="h-3 w-18" />
                  </TableCell>
                  <TableCell className="h-10 py-1">
                    <ShimmerSkeleton className="h-3 w-10" />
                  </TableCell>
                  <TableCell className="h-10 py-1">
                    <ShimmerSkeleton className="h-3 w-14" />
                  </TableCell>
                  <TableCell className="h-10 py-1 text-right">
                    <div className="flex items-center justify-end gap-1 min-w-[100px]">
                      <ShimmerSkeletonPulse className="h-3 w-14 rounded flex-shrink-0" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>


    </div>
  );
}

export default UserWorkflowSkeleton;
