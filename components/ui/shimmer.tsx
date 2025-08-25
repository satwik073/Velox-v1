import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
  children?: React.ReactNode;
}

export function Shimmer({ className, children }: ShimmerProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ShimmerText({ className }: { className?: string }) {
  return (
    <Shimmer className={cn("h-4 rounded", className)}>
      <div className="h-full w-full bg-gray-300 rounded" />
    </Shimmer>
  );
}

export function ShimmerBadge({ className }: { className?: string }) {
  return (
    <Shimmer className={cn("h-6 w-16 rounded-full", className)}>
      <div className="h-full w-full bg-gray-300 rounded-full" />
    </Shimmer>
  );
}

export function ShimmerButton({ className }: { className?: string }) {
  return (
    <Shimmer className={cn("h-8 w-16 rounded", className)}>
      <div className="h-full w-full bg-gray-300 rounded" />
    </Shimmer>
  );
}
