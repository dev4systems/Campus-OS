import React, { useEffect, Suspense, lazy } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { SessionGate } from "@/components/SessionGate";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DirectionsProvider } from "@/contexts/DirectionsContext";
import FloatingDirectionsPanel from "@/components/FloatingDirectionsPanel";
import AppLayout from "@/components/AppLayout";
// LayoutSkeleton is exported from AppLayout as a component we can use
import { LayoutSkeleton } from "@/components/AppLayout";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Student pages
const StudentDashboard = lazy(() => import("./pages/student/Dashboard"));
const Timetable = lazy(() => import("./pages/student/Timetable"));
const StudentAssignments = lazy(() => import("./pages/student/Assignments"));
const CampusNav = lazy(() => import("./pages/student/CampusNav"));
const Library = lazy(() => import("./pages/student/Library"));
const Attendance = lazy(() => import("./pages/student/Attendance"));
const Courses = lazy(() => import("./pages/student/Courses"));
const Grades = lazy(() => import("./pages/student/Grades"));
const Professors = lazy(() => import("./pages/student/Professors"));
const Fees = lazy(() => import("./pages/student/Fees"));
const Exams = lazy(() => import("./pages/student/Exams"));
const CampusBuzz = lazy(() => import("./pages/student/CampusBuzz"));
const Feedback = lazy(() => import("./pages/student/Feedback"));
const PlacementJobs = lazy(() => import("./pages/student/PlacementJobs"));
const AppliedJobs = lazy(() => import("./pages/student/AppliedJobs"));
const PlacementSchedule = lazy(() => import("./pages/student/PlacementSchedule"));
const EligibleJobs = lazy(() => import("./pages/student/EligibleJobs"));

// Teacher pages
const TeacherDashboard = lazy(() => import("./pages/teacher/Dashboard"));
const Subjects = lazy(() => import("./pages/teacher/Subjects"));
const MarkAttendance = lazy(() => import("./pages/teacher/MarkAttendance"));
const ResearchRequests = lazy(() => import("./pages/teacher/ResearchRequests"));
const TeacherAssignments = lazy(() => import("./pages/teacher/TeacherAssignments"));
const TeacherGrades = lazy(() => import("./pages/teacher/TeacherGrades"));
const Syllabus = lazy(() => import("./pages/teacher/Syllabus"));
const Materials = lazy(() => import("./pages/teacher/Materials"));
const Classes = lazy(() => import("./pages/teacher/Classes"));
const Communication = lazy(() => import("./pages/teacher/Communication"));
const FeedbackEval = lazy(() => import("./pages/teacher/FeedbackEval"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const AcademicMgmt = lazy(() => import("./pages/admin/AcademicMgmt"));
const TimetableManage = lazy(() => import("./pages/admin/TimetableManage"));
const AnalyticsDashboard = lazy(() => import("./pages/admin/Analytics"));
const AdminLibrary = lazy(() => import("./pages/admin/AdminLibrary"));
const Complaints = lazy(() => import("./pages/admin/Complaints"));
const AdminFees = lazy(() => import("./pages/admin/AdminFees"));
const Credentials = lazy(() => import("./pages/admin/Credentials"));
const Infrastructure = lazy(() => import("./pages/admin/Infrastructure"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminFeedback = lazy(() => import("./pages/admin/AdminFeedback"));

const queryClient = new QueryClient();
const ScrollRevealObserver = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    const observe = () => {
      document.querySelectorAll(".scroll-reveal:not(.revealed)").forEach((el) => observer.observe(el));
    };
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); mo.disconnect(); };
  }, []);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <SessionGate>
          <DirectionsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollRevealObserver />
              <ErrorBoundary>
              <Suspense fallback={<LayoutSkeleton />}>
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
                <Route path="/student/professors" element={<AppLayout requiredPortal="student"><Professors /></AppLayout>} />
                <Route path="/student/grades" element={<AppLayout requiredPortal="student"><Grades /></AppLayout>} />
                <Route path="/student/fees" element={<AppLayout requiredPortal="student"><Fees /></AppLayout>} />
                <Route path="/student/exams" element={<AppLayout requiredPortal="student"><Exams /></AppLayout>} />
                <Route path="/student/buzz" element={<AppLayout requiredPortal="student"><CampusBuzz /></AppLayout>} />
                <Route path="/student/feedback" element={<AppLayout requiredPortal="student"><Feedback /></AppLayout>} />
                <Route path="/student/placements/jobs" element={<AppLayout requiredPortal="student"><PlacementJobs /></AppLayout>} />
                <Route path="/student/placements/applied" element={<AppLayout requiredPortal="student"><AppliedJobs /></AppLayout>} />
                <Route path="/student/placements/schedule" element={<AppLayout requiredPortal="student"><PlacementSchedule /></AppLayout>} />
                <Route path="/student/placements/eligible" element={<AppLayout requiredPortal="student"><EligibleJobs /></AppLayout>} />

                {/* Teacher Portal */}
                <Route path="/teacher" element={<AppLayout requiredPortal="teacher"><TeacherDashboard /></AppLayout>} />
                <Route path="/teacher/subjects" element={<AppLayout requiredPortal="teacher"><Subjects /></AppLayout>} />
                <Route path="/teacher/mark-attendance" element={<AppLayout requiredPortal="teacher"><MarkAttendance /></AppLayout>} />
                <Route path="/teacher/research/requests" element={<AppLayout requiredPortal="teacher"><ResearchRequests /></AppLayout>} />
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
                <Route path="/admin/timetable/manage" element={<AppLayout requiredPortal="admin"><TimetableManage /></AppLayout>} />
                <Route path="/admin/analytics" element={<AppLayout requiredPortal="admin"><AnalyticsDashboard /></AppLayout>} />
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
              </Suspense>
              </ErrorBoundary>
              <FloatingDirectionsPanel />
            </BrowserRouter>
          </TooltipProvider>
          </DirectionsProvider>
        </SessionGate>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
