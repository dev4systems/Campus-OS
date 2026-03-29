import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppLayout from "@/components/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";

// Student pages
import StudentDashboard from "./pages/student/Dashboard";
import Timetable from "./pages/student/Timetable";
import StudentAssignments from "./pages/student/Assignments";
import CampusNav from "./pages/student/CampusNav";
import Library from "./pages/student/Library";
import Attendance from "./pages/student/Attendance";
import Courses from "./pages/student/Courses";
import Grades from "./pages/student/Grades";
import Fees from "./pages/student/Fees";
import Exams from "./pages/student/Exams";
import CampusBuzz from "./pages/student/CampusBuzz";
import Feedback from "./pages/student/Feedback";

// Teacher pages
import TeacherDashboard from "./pages/teacher/Dashboard";
import Subjects from "./pages/teacher/Subjects";
import MarkAttendance from "./pages/teacher/MarkAttendance";
import TeacherAssignments from "./pages/teacher/TeacherAssignments";
import TeacherGrades from "./pages/teacher/TeacherGrades";
import Syllabus from "./pages/teacher/Syllabus";
import Materials from "./pages/teacher/Materials";
import Classes from "./pages/teacher/Classes";
import Communication from "./pages/teacher/Communication";
import FeedbackEval from "./pages/teacher/FeedbackEval";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import AcademicMgmt from "./pages/admin/AcademicMgmt";
import AdminLibrary from "./pages/admin/AdminLibrary";
import Complaints from "./pages/admin/Complaints";
import AdminFees from "./pages/admin/AdminFees";
import Credentials from "./pages/admin/Credentials";
import Infrastructure from "./pages/admin/Infrastructure";
import Reports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminFeedback from "./pages/admin/AdminFeedback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Student Portal */}
              <Route path="/student" element={<AppLayout requiredPortal="student"><StudentDashboard /></AppLayout>} />
              <Route path="/student/timetable" element={<AppLayout requiredPortal="student"><Timetable /></AppLayout>} />
              <Route path="/student/assignments" element={<AppLayout requiredPortal="student"><StudentAssignments /></AppLayout>} />
              <Route path="/student/campus-nav" element={<AppLayout requiredPortal="student"><CampusNav /></AppLayout>} />
              <Route path="/student/library" element={<AppLayout requiredPortal="student"><Library /></AppLayout>} />
              <Route path="/student/attendance" element={<AppLayout requiredPortal="student"><Attendance /></AppLayout>} />
              <Route path="/student/courses" element={<AppLayout requiredPortal="student"><Courses /></AppLayout>} />
              <Route path="/student/grades" element={<AppLayout requiredPortal="student"><Grades /></AppLayout>} />
              <Route path="/student/fees" element={<AppLayout requiredPortal="student"><Fees /></AppLayout>} />
              <Route path="/student/exams" element={<AppLayout requiredPortal="student"><Exams /></AppLayout>} />
              <Route path="/student/buzz" element={<AppLayout requiredPortal="student"><CampusBuzz /></AppLayout>} />
              <Route path="/student/feedback" element={<AppLayout requiredPortal="student"><Feedback /></AppLayout>} />

              {/* Teacher Portal */}
              <Route path="/teacher" element={<AppLayout requiredPortal="teacher"><TeacherDashboard /></AppLayout>} />
              <Route path="/teacher/subjects" element={<AppLayout requiredPortal="teacher"><Subjects /></AppLayout>} />
              <Route path="/teacher/mark-attendance" element={<AppLayout requiredPortal="teacher"><MarkAttendance /></AppLayout>} />
              <Route path="/teacher/assignments" element={<AppLayout requiredPortal="teacher"><TeacherAssignments /></AppLayout>} />
              <Route path="/teacher/grades" element={<AppLayout requiredPortal="teacher"><TeacherGrades /></AppLayout>} />
              <Route path="/teacher/syllabus" element={<AppLayout requiredPortal="teacher"><Syllabus /></AppLayout>} />
              <Route path="/teacher/materials" element={<AppLayout requiredPortal="teacher"><Materials /></AppLayout>} />
              <Route path="/teacher/classes" element={<AppLayout requiredPortal="teacher"><Classes /></AppLayout>} />
              <Route path="/teacher/communication" element={<AppLayout requiredPortal="teacher"><Communication /></AppLayout>} />
              <Route path="/teacher/feedback-eval" element={<AppLayout requiredPortal="teacher"><FeedbackEval /></AppLayout>} />
              <Route path="/teacher/buzz" element={<AppLayout requiredPortal="teacher"><CampusBuzz /></AppLayout>} />

              {/* Admin Portal */}
              <Route path="/admin" element={<AppLayout requiredPortal="admin"><AdminDashboard /></AppLayout>} />
              <Route path="/admin/users" element={<AppLayout requiredPortal="admin"><UserManagement /></AppLayout>} />
              <Route path="/admin/academic" element={<AppLayout requiredPortal="admin"><AcademicMgmt /></AppLayout>} />
              <Route path="/admin/library" element={<AppLayout requiredPortal="admin"><AdminLibrary /></AppLayout>} />
              <Route path="/admin/complaints" element={<AppLayout requiredPortal="admin"><Complaints /></AppLayout>} />
              <Route path="/admin/fees" element={<AppLayout requiredPortal="admin"><AdminFees /></AppLayout>} />
              <Route path="/admin/credentials" element={<AppLayout requiredPortal="admin"><Credentials /></AppLayout>} />
              <Route path="/admin/infrastructure" element={<AppLayout requiredPortal="admin"><Infrastructure /></AppLayout>} />
              <Route path="/admin/reports" element={<AppLayout requiredPortal="admin"><Reports /></AppLayout>} />
              <Route path="/admin/settings" element={<AppLayout requiredPortal="admin"><AdminSettings /></AppLayout>} />
              <Route path="/admin/buzz" element={<AppLayout requiredPortal="admin"><CampusBuzz /></AppLayout>} />
              <Route path="/admin/feedback" element={<AppLayout requiredPortal="admin"><AdminFeedback /></AppLayout>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
