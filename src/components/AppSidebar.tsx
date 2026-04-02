import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard, Calendar, ClipboardList, MapPin, BookOpen, BarChart3,
  GraduationCap, CreditCard, FileText, Megaphone, MessageSquare,
  Users, BookMarked, Upload, FolderOpen, School, Send, Star,
  Settings, Shield, Building2, FileBarChart, Key, AlertTriangle,
  Briefcase, ClipboardCheck, CalendarClock, ChevronDown,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, SidebarFooter,
} from "@/components/ui/sidebar";

const studentNav = [
  { title: "Dashboard", url: "/student", icon: LayoutDashboard },
  { title: "Timetable", url: "/student/timetable", icon: Calendar },
  { title: "Assignments", url: "/student/assignments", icon: ClipboardList },
  { title: "Campus Map", url: "/student/campus-nav", icon: MapPin },
  { title: "Library", url: "/student/library", icon: BookOpen },
  { title: "Attendance", url: "/student/attendance", icon: BarChart3 },
  { title: "Courses", url: "/student/courses", icon: GraduationCap },
  { title: "Grades", url: "/student/grades", icon: Star },
  { title: "Fees", url: "/student/fees", icon: CreditCard },
  { title: "Exams", url: "/student/exams", icon: FileText },
  { title: "Campus Buzz", url: "/student/buzz", icon: Megaphone },
  { title: "Feedback", url: "/student/feedback", icon: MessageSquare },
];

const placementNav = [
  { title: "Jobs", url: "/student/placements/jobs", icon: Building2 },
  { title: "Applied Jobs", url: "/student/placements/applied", icon: ClipboardCheck },
  { title: "My Schedule", url: "/student/placements/schedule", icon: CalendarClock },
];

const teacherNav = [
  { title: "Dashboard", url: "/teacher", icon: LayoutDashboard },
  { title: "My Subjects", url: "/teacher/subjects", icon: BookMarked },
  { title: "Mark Attendance", url: "/teacher/mark-attendance", icon: BarChart3 },
  { title: "Assignments", url: "/teacher/assignments", icon: ClipboardList },
  { title: "Grades", url: "/teacher/grades", icon: Star },
  { title: "Syllabus Upload", url: "/teacher/syllabus", icon: Upload },
  { title: "Course Materials", url: "/teacher/materials", icon: FolderOpen },
  { title: "My Classes", url: "/teacher/classes", icon: School },
  { title: "Communication", url: "/teacher/communication", icon: Send },
  { title: "Feedback & Eval", url: "/teacher/feedback-eval", icon: MessageSquare },
  { title: "Campus Buzz", url: "/teacher/buzz", icon: Megaphone },
];

const adminNav = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "User Management", url: "/admin/users", icon: Users },
  { title: "Academic Mgmt", url: "/admin/academic", icon: GraduationCap },
  { title: "Library Mgmt", url: "/admin/library", icon: BookOpen },
  { title: "Complaints", url: "/admin/complaints", icon: AlertTriangle },
  { title: "Fee Management", url: "/admin/fees", icon: CreditCard },
  { title: "Access Control", url: "/admin/credentials", icon: Key },
  { title: "Infrastructure", url: "/admin/infrastructure", icon: Building2 },
  { title: "Reports", url: "/admin/reports", icon: FileBarChart },
  { title: "Settings", url: "/admin/settings", icon: Settings },
  { title: "Campus Buzz", url: "/admin/buzz", icon: Megaphone },
  { title: "Feedback Mgmt", url: "/admin/feedback", icon: MessageSquare },
];

const AppSidebar = () => {
  const { user } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const prevCollapsed = useRef(collapsed);
  const [animState, setAnimState] = useState<"idle" | "entering" | "exiting">("idle");

  useEffect(() => {
    if (prevCollapsed.current && !collapsed) {
      setAnimState("entering");
      const t = setTimeout(() => setAnimState("idle"), 600);
      return () => clearTimeout(t);
    }
    if (!prevCollapsed.current && collapsed) {
      setAnimState("exiting");
      const t = setTimeout(() => setAnimState("idle"), 400);
      return () => clearTimeout(t);
    }
    prevCollapsed.current = collapsed;
  }, [collapsed]);

  useEffect(() => { prevCollapsed.current = collapsed; });

  const navItems = user?.portal === "student" ? studentNav : user?.portal === "teacher" ? teacherNav : adminNav;
  const portalLabel = user?.portal === "student" ? "Student Portal" : user?.portal === "teacher" ? "Teacher Portal" : "Admin Portal";
  const totalItems = navItems.length;

  const getItemStyle = (index: number): React.CSSProperties => {
    if (animState === "entering") {
      return { animationDelay: `${index * 40}ms` };
    }
    if (animState === "exiting") {
      return { animationDelay: `${(totalItems - 1 - index) * 30}ms` };
    }
    return {};
  };

  const getItemClass = () => {
    if (animState === "entering") return "sidebar-item-enter";
    if (animState === "exiting") return "sidebar-item-exit";
    return "";
  };

  const panelClass = animState === "entering" ? "sidebar-panel-enter" : animState === "exiting" ? "sidebar-panel-exit" : "";

  return (
    <Sidebar collapsible="icon" className={`border-r border-border ${panelClass}`}>
      <SidebarContent>
        {!collapsed && (
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-lg font-extrabold text-gradient">Nexus</h2>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{portalLabel}</p>
          </div>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>{collapsed ? "" : "Navigation"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item, index) => (
                <SidebarMenuItem key={item.url} className={getItemClass()} style={getItemStyle(index)}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === `/student` || item.url === `/teacher` || item.url === `/admin`}
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 mr-2 shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {!collapsed && (
        <SidebarFooter className="p-4">
          <p className="text-[10px] text-muted-foreground text-center">© 2026 NIT Durgapur</p>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default AppSidebar;
