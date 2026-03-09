import { BarChart3, Users, ClipboardList, Star, Bell, Calendar } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { teacherSubjects, teacherStudents } from "@/data/mockData";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const lowAttendance = teacherStudents.filter((s) => s.attendance < 75).length;
  const totalStudents = teacherSubjects.reduce((s, sub) => s + sub.students, 0);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, {user?.name}</h1>
        <p className="text-sm text-muted-foreground">{user?.department}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={totalStudents} icon={Users} variant="primary" />
        <StatCard title="Low Attendance" value={lowAttendance} icon={BarChart3} variant="danger" subtitle="Below 75%" />
        <StatCard title="Pending Reviews" value={3} icon={ClipboardList} variant="warning" subtitle="Assignment submissions" />
        <StatCard title="Pending Grades" value={1} icon={Star} variant="default" subtitle="Mid-sem grades" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4"><Bell className="h-4 w-4 text-primary" /> Alerts</h2>
          <div className="space-y-3">
            <div className="rounded-lg bg-status-warning/5 border border-status-warning/20 p-3">
              <p className="text-sm font-medium text-foreground">Mid-sem syllabus upload deadline</p>
              <p className="text-xs text-muted-foreground">CS301 · Due in 5 days</p>
            </div>
            <div className="rounded-lg bg-muted/30 border border-border p-3">
              <p className="text-sm font-medium text-foreground">3 assignments pending review</p>
              <p className="text-xs text-muted-foreground">CS301 Section A · Submitted Mar 8</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4"><Calendar className="h-4 w-4 text-primary" /> Today's Classes</h2>
          <div className="space-y-2">
            {[
              { time: "9:00 - 10:00", subject: "CS301 (Sec A)", room: "LH-201" },
              { time: "11:30 - 12:30", subject: "CS501 (Sec A)", room: "LH-302" },
              { time: "2:00 - 3:00", subject: "CS301 (Sec B)", room: "LH-203" },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.subject}</p>
                  <p className="text-xs text-muted-foreground">{c.time}</p>
                </div>
                <span className="text-xs text-muted-foreground">{c.room}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
