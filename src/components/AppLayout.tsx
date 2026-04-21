import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, Portal } from "@/contexts/AuthContext";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import AnimatedPage from "@/components/AnimatedPage";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

interface AppLayoutProps {
  children: ReactNode;
  requiredPortal?: Portal;
}

export const LayoutSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-full max-w-6xl p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <Skeleton className="h-48 rounded-xl lg:col-span-2" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  </div>
);

const AppLayout = ({ children, requiredPortal }: AppLayoutProps) => {
  const { user, isAuthenticated, sessionLoading } = useAuth();
  const location = useLocation();

  if (sessionLoading) {
    return <LayoutSkeleton />;
  }

  if (!isAuthenticated || !user) return <Navigate to="/" replace />;
  if (requiredPortal && user.portal !== requiredPortal) return <Navigate to={`/${user.portal}`} replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            <AnimatedPage key={location.pathname}>
              {children}
            </AnimatedPage>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
