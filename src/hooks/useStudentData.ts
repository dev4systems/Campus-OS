import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  attendanceData as mockAttendance,
  gradesData as mockGrades,
  assignmentsData as mockAssignments,
  feesData as mockFees,
  coursesData as mockCourses,
  studentStats as mockStats,
} from "@/data/mockData";

/* ── shared types ────────────────────────────────────── */

export interface SubjectRow {
  id: string;
  code: string;
  name: string;
  credits: number;
  professor: string;
  office: string;
  semester: number;
}

export interface AttendanceRow {
  code: string;
  subject: string;
  total: number;
  attended: number;
  percentage: number;
  status: "good" | "warning" | "danger";
}

export interface GradeRow {
  code: string;
  subject: string;
  grade: string;
  score: number;
  maxScore: number;
  classAvg: number;
  credits: number;
  semester: number;
}

export interface AssignmentRow {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  professor: string;
  status: "pending" | "submitted" | "overdue";
  grade?: string;
  feedback?: string;
}

export interface FeeRow {
  type: string;
  amount: number;
  paid: number;
  status: "paid" | "pending";
  dueDate: string;
  txnId?: string;
}

/* ── helpers ─────────────────────────────────────────── */

function attendanceStatus(pct: number): "good" | "warning" | "danger" {
  if (pct >= 75) return "good";
  if (pct >= 65) return "warning";
  return "danger";
}

/* ── hooks ───────────────────────────────────────────── */

export function useSubjects(userId: string | undefined, semester: number, isDemo: boolean) {
  return useQuery({
    queryKey: ["subjects", userId, semester],
    queryFn: async (): Promise<SubjectRow[]> => {
      // Try enrolled subjects first
      const { data: enrolled } = await supabase
        .from("enrollments")
        .select("subject_id, subjects(id, code, name, credits, professor, office, semester)")
        .eq("user_id", userId!)
        .eq("semester", semester) as any;

      if (enrolled?.length) {
        return enrolled.map((e: any) => e.subjects);
      }

      // Fall back to all subjects for this semester
      const { data: subjects } = await supabase
        .from("subjects")
        .select("id, code, name, credits, professor, office, semester")
        .eq("semester", semester) as any;

      return subjects || [];
    },
    enabled: !!userId && !isDemo,
  });
}

export function useAttendance(userId: string | undefined, isDemo: boolean) {
  return useQuery({
    queryKey: ["attendance", userId],
    queryFn: async (): Promise<AttendanceRow[]> => {
      const { data } = await supabase
        .from("attendance")
        .select("total_classes, attended_classes, subjects(code, name)")
        .eq("user_id", userId!) as any;

      if (!data?.length) return [];

      return data.map((row: any) => {
        const pct = row.total_classes > 0
          ? Math.round((row.attended_classes / row.total_classes) * 100)
          : 0;
        return {
          code: row.subjects.code,
          subject: row.subjects.name,
          total: row.total_classes,
          attended: row.attended_classes,
          percentage: pct,
          status: attendanceStatus(pct),
        };
      });
    },
    enabled: !!userId && !isDemo,
  });
}

export function useGrades(userId: string | undefined, isDemo: boolean) {
  return useQuery({
    queryKey: ["grades", userId],
    queryFn: async (): Promise<GradeRow[]> => {
      const { data } = await supabase
        .from("grades")
        .select("semester, grade, score, max_score, class_avg, subjects(code, name, credits)")
        .eq("user_id", userId!)
        .order("semester", { ascending: true }) as any;

      if (!data?.length) return [];

      return data.map((row: any) => ({
        code: row.subjects.code,
        subject: row.subjects.name,
        grade: row.grade,
        score: Number(row.score),
        maxScore: Number(row.max_score),
        classAvg: Number(row.class_avg),
        credits: row.subjects.credits,
        semester: row.semester,
      }));
    },
    enabled: !!userId && !isDemo,
  });
}

export function useAssignments(userId: string | undefined, isDemo: boolean) {
  return useQuery({
    queryKey: ["assignments", userId],
    queryFn: async (): Promise<AssignmentRow[]> => {
      // Get assignments with subject info
      const { data: assignments } = await supabase
        .from("assignments")
        .select("id, title, description, due_date, professor, subjects(code)")
        .order("due_date", { ascending: true }) as any;

      if (!assignments?.length) return [];

      // Get user's submissions
      const { data: submissions } = await supabase
        .from("assignment_submissions")
        .select("assignment_id, status, grade, feedback")
        .eq("user_id", userId!) as any;

      const subMap = new Map<string, any>((submissions || []).map((s: any) => [s.assignment_id, s]));

      return assignments.map((a: any) => {
        const sub: any = subMap.get(a.id);
        let status: "pending" | "submitted" | "overdue" = "pending";
        if (sub?.status === "submitted") status = "submitted";
        else if (new Date(a.due_date) < new Date()) status = "overdue";

        return {
          id: a.id,
          subject: a.subjects?.code || "",
          title: a.title,
          description: a.description || "",
          dueDate: a.due_date,
          professor: a.professor || "",
          status,
          grade: sub?.grade || undefined,
          feedback: sub?.feedback || undefined,
        };
      });
    },
    enabled: !!userId && !isDemo,
  });
}

export function useFees(userId: string | undefined, isDemo: boolean) {
  return useQuery({
    queryKey: ["fees", userId],
    queryFn: async (): Promise<FeeRow[]> => {
      const { data } = await supabase
        .from("fees")
        .select("fee_type, amount, paid, status, due_date, txn_id")
        .eq("user_id", userId!)
        .order("due_date", { ascending: true }) as any;

      if (!data?.length) return [];

      return data.map((row: any) => ({
        type: row.fee_type,
        amount: Number(row.amount),
        paid: Number(row.paid),
        status: row.status as "paid" | "pending",
        dueDate: row.due_date,
        txnId: row.txn_id || undefined,
      }));
    },
    enabled: !!userId && !isDemo,
  });
}

/* ── dashboard aggregate ─────────────────────────────── */

export function useDashboardStats(userId: string | undefined, isDemo: boolean) {
  const attendance = useAttendance(userId, isDemo);
  const grades = useGrades(userId, isDemo);
  const assignments = useAssignments(userId, isDemo);
  const fees = useFees(userId, isDemo);

  const loading = attendance.isLoading || grades.isLoading || assignments.isLoading || fees.isLoading;

  if (isDemo) {
    return { loading: false, stats: mockStats };
  }

  const attData = attendance.data || [];
  const avgAttendance = attData.length
    ? Math.round(attData.reduce((s, a) => s + a.percentage, 0) / attData.length)
    : 0;

  const gradeData = grades.data || [];
  // Simple CGPA approximation from grade points
  const cgpa = gradeData.length
    ? Number((gradeData.reduce((s, g) => s + g.score * g.credits, 0) / gradeData.reduce((s, g) => s + g.maxScore * g.credits, 0) * 10).toFixed(2))
    : 0;

  const activeAssignments = (assignments.data || []).filter(
    (a) => a.status === "pending" || a.status === "overdue"
  ).length;

  const feeData = fees.data || [];
  const pendingFees = feeData.reduce((s, f) => s + (f.amount - f.paid), 0);

  return {
    loading,
    stats: { attendance: avgAttendance, cgpa, activeAssignments, pendingFees },
  };
}

/* ── demo data re-exports (for demo mode fallback) ──── */

export {
  mockAttendance,
  mockGrades,
  mockAssignments,
  mockFees,
  mockCourses,
  mockStats,
};
