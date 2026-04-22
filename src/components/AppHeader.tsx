import { useAuth } from "@/contexts/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import FuseSearch from "@/components/FuseSearch";
import { NotificationPopover } from "@/components/NotificationPopover";

const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="h-14 flex items-center justify-between border-b border-border px-4 glass-strong">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
          {user?.portal === "student" && `Sem ${user.semester} · ${user.department}`}
          {user?.portal === "teacher" && user.department}
          {user?.portal === "admin" && "Administration"}
        </span>
        {user?.isDemo && (
          <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-nexus-amber/20 text-nexus-amber border border-nexus-amber/30">
            Demo
          </span>
        )}
      </div>
      <div className="hidden md:block flex-1 max-w-sm mx-4">
        <FuseSearch placeholder="Search pages..." />
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationPopover />
        <div className="hidden sm:flex items-center gap-2 mr-2">
          <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <span className="text-sm font-medium text-foreground">{user?.name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive" data-tooltip="Logout">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
