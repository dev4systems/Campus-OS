import { attendanceData } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";

const statusColors = {
  good: { bg: "bg-status-success/10", text: "text-status-success", border: "border-status-success/20", badge: "🟢" },
  warning: { bg: "bg-status-warning/10", text: "text-status-warning", border: "border-status-warning/20", badge: "🟡" },
  danger: { bg: "bg-status-danger/10", text: "text-status-danger", border: "border-status-danger/20", badge: "🔴" },
};

const Attendance = () => {
  const overall = Math.round(attendanceData.reduce((s, a) => s + a.percentage, 0) / attendanceData.length);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground">Subject-wise attendance breakdown</p>
      </div>

      <div className="scroll-reveal rounded-xl border border-border bg-card p-5 flex items-center gap-4">
        <div className="h-16 w-16 rounded-full border-4 border-primary flex items-center justify-center">
          <span className="text-xl font-bold text-foreground">{overall}%</span>
        </div>
        <div>
          <p className="font-semibold text-foreground">Overall Attendance</p>
          <p className="text-xs text-muted-foreground">Minimum 75% required to sit for exams</p>
        </div>
      </div>

      <div className="space-y-3">
        {attendanceData.map((subject, i) => {
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
              <Progress value={subject.percentage} className="h-2 mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Attended: {subject.attended}/{subject.total}</span>
                {subject.status === "danger" && <span className="text-status-danger font-medium">⚠ Risk of debarment</span>}
                {subject.status === "warning" && <span className="text-status-warning font-medium">Need {Math.ceil(subject.total * 0.75) - subject.attended} more classes</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Attendance;
