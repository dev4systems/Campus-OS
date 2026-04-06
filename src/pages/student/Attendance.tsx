import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance, mockAttendance } from "@/hooks/useStudentData";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarCheck, AlertTriangle } from "lucide-react";
import EmptyState from "@/components/EmptyState";

const statusColors = {
  good: { bg: "bg-status-success/10", text: "text-status-success", border: "border-status-success/20", badge: "🟢", bar: "bg-status-success" },
  warning: { bg: "bg-status-warning/10", text: "text-status-warning", border: "border-status-warning/20", badge: "🟡", bar: "bg-status-warning" },
  danger: { bg: "bg-status-danger/10", text: "text-status-danger", border: "border-status-danger/20", badge: "🔴", bar: "bg-status-danger" },
};

const Attendance = () => {
  const { user } = useAuth();
  const isDemo = !!user?.isDemo;
  const { data: realData, isLoading } = useAttendance(user?.id, isDemo);

  const attendanceList = isDemo
    ? mockAttendance.map(a => ({
        code: a.code,
        subject: a.subject,
        total: a.total,
        attended: a.attended,
        percentage: a.percentage,
        status: a.status,
      }))
    : (realData || []);

  const loading = !isDemo && isLoading;

  const overall = attendanceList.length
    ? Math.round(attendanceList.reduce((s, a) => s + a.percentage, 0) / attendanceList.length)
    : 0;

  const lowSubjects = attendanceList.filter(a => a.percentage < 75);
  const overallColor = overall >= 75 ? "text-status-success" : overall >= 60 ? "text-status-warning" : "text-status-danger";
  const overallBorderColor = overall >= 75 ? "border-status-success" : overall >= 60 ? "border-status-warning" : "border-status-danger";

  // Animate progress bars on mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground">Subject-wise attendance breakdown</p>
      </div>

      {loading ? (
        <>
          <Skeleton className="h-24 rounded-xl" />
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </>
      ) : attendanceList.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No attendance records" subtitle="Attendance will be tracked once classes begin." />
      ) : (
        <>
          {/* Warning banner */}
          {lowSubjects.length > 0 && (
            <div className="scroll-reveal rounded-xl border border-status-warning/30 bg-status-warning/5 p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-status-warning mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  ⚠️ Low attendance in {lowSubjects.length} subject{lowSubjects.length > 1 ? "s" : ""}. Minimum required: 75%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {lowSubjects.map(s => `${s.subject} (${s.percentage}%)`).join(" · ")}
                </p>
              </div>
            </div>
          )}

          {/* Overall */}
          <div className="scroll-reveal rounded-xl border border-border bg-card p-5 flex items-center gap-4">
            <div className={`h-16 w-16 rounded-full border-4 ${overallBorderColor} flex items-center justify-center`}>
              <span className={`text-xl font-bold ${overallColor}`}>{overall}%</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">Overall Attendance</p>
              <p className="text-xs text-muted-foreground">Minimum 75% required to sit for exams</p>
            </div>
          </div>

          {/* Per-subject */}
          <div className="space-y-3">
            {attendanceList.map((subject, i) => {
              const colors = statusColors[subject.status];
              return (
                <div key={subject.code} className={`scroll-reveal rounded-xl border ${colors.border} ${colors.bg} p-5`} style={{ transitionDelay: `${i * 70}ms` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{colors.badge}</span>
                        <h3 className="font-semibold text-foreground">{subject.subject}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{subject.code}</p>
                    </div>
                    <span className={`text-2xl font-bold ${colors.text}`}>{subject.percentage}%</span>
                  </div>

                  {/* Animated progress bar */}
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${colors.bar}`}
                      style={{
                        width: mounted ? `${subject.percentage}%` : "0%",
                        transition: "width 600ms ease",
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Attended: {subject.attended}/{subject.total}</span>
                    {subject.status === "danger" && <span className="text-status-danger font-medium">⚠ Risk of debarment</span>}
                    {subject.status === "warning" && <span className="text-status-warning font-medium">Need {Math.ceil(subject.total * 0.75) - subject.attended} more classes</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Attendance;
