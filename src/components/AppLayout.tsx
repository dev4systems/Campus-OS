import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, Portal } from "@/contexts/AuthContext";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: ReactNode;
  requiredPortal?: Portal;
}

const AppLayout = ({ children, requiredPortal }: AppLayoutProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return <Navigate to="/" replace />;
  if (requiredPortal && user.portal !== requiredPortal) return <Navigate to={`/${user.portal}`} replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
