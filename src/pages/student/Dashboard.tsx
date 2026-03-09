import { BarChart3, BookOpen, ClipboardList, CreditCard, Trophy, Calendar, Bell } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { studentStats, assignmentsData, examsData, buzzPosts, trendingTags } from "@/data/mockData";

const StudentDashboard = () => {
  const { user } = useAuth();

  const upcomingExam = examsData[0];
  const pendingAssignments = assignmentsData.filter((a) => a.status === "pending" || a.status === "overdue");

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, {user?.name}</h1>
        <p className="text-sm text-muted-foreground">Semester {user?.semester} · {user?.department}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attendance" value={`${studentStats.attendance}%`} icon={BarChart3} variant="primary" subtitle="Overall average" />
        <StatCard title="CGPA" value={studentStats.cgpa} icon={Trophy} variant="success" subtitle="Current CGPA" />
        <StatCard title="Assignments" value={studentStats.activeAssignments} icon={ClipboardList} variant="warning" subtitle="Active/pending" />
        <StatCard title="Pending Fees" value={`₹${studentStats.pendingFees.toLocaleString()}`} icon={CreditCard} variant="danger" subtitle="Due this semester" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Alerts & Upcoming */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Alerts */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
              <Bell className="h-4 w-4 text-primary" /> Quick Alerts
            </h2>
            <div className="space-y-3">
              {upcomingExam && (
                <div className="flex items-start gap-3 rounded-lg bg-status-warning/5 border border-status-warning/20 p-3">
                  <Calendar className="h-4 w-4 text-status-warning mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{upcomingExam.type}: {upcomingExam.subject}</p>
                    <p className="text-xs text-muted-foreground">{upcomingExam.date} · {upcomingExam.time} · {upcomingExam.room}</p>
                  </div>
                </div>
              )}
              {pendingAssignments.map((a) => (
                <div key={a.id} className={`flex items-start gap-3 rounded-lg p-3 ${a.status === "overdue" ? "bg-status-danger/5 border border-status-danger/20" : "bg-muted/30 border border-border"}`}>
                  <ClipboardList className={`h-4 w-4 mt-0.5 shrink-0 ${a.status === "overdue" ? "text-status-danger" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.subject} · Due: {a.dueDate} {a.status === "overdue" && "· OVERDUE"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
              <Trophy className="h-4 w-4 text-nexus-amber" /> Recent Achievements
            </h2>
            <div className="space-y-3">
              {buzzPosts.filter((p) => p.type === "achievement" || p.type === "news").slice(0, 3).map((post) => (
                <div key={post.id} className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{post.avatar}</div>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground line-clamp-2">{post.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{post.author} · {post.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trending & Quick Links */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">🔥 Campus Trending</h2>
            <div className="space-y-2">
              {trendingTags.slice(0, 5).map((tag) => (
                <div key={tag.tag} className="flex items-center justify-between text-sm">
                  <span className="text-primary font-medium">{tag.tag}</span>
                  <span className="text-xs text-muted-foreground">{tag.count >= 1000 ? `${(tag.count / 1000).toFixed(1)}K` : tag.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">📅 Upcoming Events</h2>
            <div className="space-y-2">
              {buzzPosts.filter((p) => p.type === "event").slice(0, 3).map((event) => (
                <div key={event.id} className="rounded-lg bg-muted/30 p-2.5">
                  <p className="text-sm text-foreground line-clamp-2">{event.content.split("\n")[0]}</p>
                  <p className="text-xs text-muted-foreground mt-1">{event.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">📚 Quick Links</h2>
            <div className="grid grid-cols-2 gap-2">
              {[{ label: "Timetable", icon: Calendar }, { label: "Library", icon: BookOpen }, { label: "Grades", icon: Trophy }, { label: "Fees", icon: CreditCard }].map((link) => (
                <button key={link.label} className="flex items-center gap-2 rounded-lg bg-muted/30 p-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors">
                  <link.icon className="h-3.5 w-3.5 text-primary" />
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
