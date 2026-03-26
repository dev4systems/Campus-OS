import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, Portal } from "@/contexts/AuthContext";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import AnimatedPage from "@/components/AnimatedPage";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: ReactNode;
  requiredPortal?: Portal;
}

const AppLayout = ({ children, requiredPortal }: AppLayoutProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
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
