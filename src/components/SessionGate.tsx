import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";

export const SessionGate = ({ children }: { children: ReactNode }) => {
  const { sessionLoading } = useAuth();

  if (sessionLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>
        <p className="mt-8 text-sm font-medium animate-pulse text-muted-foreground">
          Establishing secure session...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
