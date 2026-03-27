import { useState, useEffect } from "react";
import { BarChart3, BookOpen, ClipboardList, CreditCard, Trophy, Calendar, Bell, ChevronDown, Check } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { studentStats, assignmentsData, examsData, buzzPosts, trendingTags, gradesData } from "@/data/mockData";

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const semesterSubjects: Record<number, { code: string; name: string; credits: number }[]> = {
  1: [{ code: "MA101", name: "Mathematics I", credits: 4 }, { code: "PH101", name: "Physics I", credits: 4 }, { code: "CS101", name: "Intro to Programming", credits: 3 }],
  2: [{ code: "MA102", name: "Mathematics II", credits: 4 }, { code: "CH101", name: "Chemistry", credits: 4 }, { code: "CS102", name: "Data Structures Basics", credits: 3 }],
  3: [{ code: "CS201", name: "OOP", credits: 4 }, { code: "CS202", name: "Digital Logic", credits: 3 }, { code: "MA201", name: "Mathematics III", credits: 4 }],
  4: [{ code: "CS251", name: "Algorithms", credits: 4 }, { code: "CS252", name: "Software Engineering", credits: 4 }, { code: "CS253", name: "Theory of Computation", credits: 3 }],
  5: [{ code: "CS301", name: "Data Structures & Algorithms", credits: 4 }, { code: "CS302", name: "Operating Systems", credits: 4 }, { code: "CS303", name: "Computer Networks", credits: 3 }],
  6: [{ code: "CS351", name: "Compiler Design", credits: 4 }, { code: "CS352", name: "AI & ML", credits: 4 }, { code: "CS353", name: "Information Security", credits: 3 }],
  7: [{ code: "CS401", name: "Cloud Computing", credits: 4 }, { code: "CS402", name: "Deep Learning", credits: 3 }, { code: "CS403", name: "Big Data Analytics", credits: 3 }],
  8: [{ code: "CS451", name: "Project", credits: 6 }, { code: "CS452", name: "Seminar", credits: 2 }],
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [selectedSem, setSelectedSem] = useState<number>(() => {
    const saved = localStorage.getItem("cc_selected_sem");
    return saved ? parseInt(saved, 10) : (user?.semester || 5);
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cc_selected_sem", String(selectedSem));
  }, [selectedSem]);

  const upcomingExam = examsData[0];
  const pendingAssignments = assignmentsData.filter((a) => a.status === "pending" || a.status === "overdue");
  const subjects = semesterSubjects[selectedSem] || [];
  const semGPA = gradesData.semesterGPAs.find(s => s.sem === selectedSem);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome, {user?.name}</h1>
          <p className="text-sm text-muted-foreground">Semester {user?.semester} · {user?.department}</p>
        </div>

        {/* Semester Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:border-primary/40 transition-colors min-w-[180px] justify-between"
          >
            <span>Semester {selectedSem}</span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-lg overflow-hidden">
                {SEMESTERS.map((sem, i) => (
                  <button
                    key={sem}
                    onClick={() => { setSelectedSem(sem); setDropdownOpen(false); }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-muted/50 ${selectedSem === sem ? "bg-primary/10 text-primary font-medium" : "text-foreground"}`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <span>Semester {sem}</span>
                    {selectedSem === sem && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Semester Subjects */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" /> Semester {selectedSem} Subjects
          {semGPA && <span className="ml-auto text-xs text-muted-foreground">SGPA: {semGPA.gpa}</span>}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.map((sub) => (
            <div key={sub.code} className="rounded-lg border border-border bg-muted/20 p-3">
              <p className="text-sm font-medium text-foreground">{sub.name}</p>
              <p className="text-xs text-muted-foreground">{sub.code} · {sub.credits} Credits</p>
            </div>
          ))}
        </div>
        {subjects.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No subject data available for this semester.</p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Attendance" value={`${studentStats.attendance}%`} icon={BarChart3} variant="primary" subtitle="Overall average" />
        <StatCard title="CGPA" value={studentStats.cgpa} icon={Trophy} variant="success" subtitle="Current CGPA" />
        <StatCard title="Assignments" value={studentStats.activeAssignments} icon={ClipboardList} variant="warning" subtitle="Active/pending" />
        <StatCard title="Pending Fees" value={`₹${studentStats.pendingFees.toLocaleString()}`} icon={CreditCard} variant="danger" subtitle="Due this semester" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
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
