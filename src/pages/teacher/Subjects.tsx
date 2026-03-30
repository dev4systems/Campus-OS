import { teacherSubjects, teacherStudents } from "@/data/mockData";
import { useState } from "react";
import { Users, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Subjects = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Subjects</h1>
        <p className="text-sm text-muted-foreground">{teacherSubjects.length} subjects assigned this semester</p>
      </div>

      <div className="space-y-3">
        {teacherSubjects.map((sub, i) => {
          const key = `${sub.code}-${sub.section}`;
          const isOpen = expanded === key;
          return (
            <div key={i} className="scroll-reveal rounded-xl border border-border bg-card" style={{ transitionDelay: `${i * 70}ms` }}>
              <button onClick={() => setExpanded(isOpen ? null : key)} className="w-full p-5 flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{sub.name}</h3>
                    <p className="text-xs text-muted-foreground">{sub.code} · Sem {sub.semester} · Section {sub.section}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs"><Users className="h-4 w-4 mr-1" /> {sub.students}</Badge>
                  {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </div>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-border pt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Students</p>
                  <div className="space-y-2">
                    {teacherStudents.map((s) => (
                      <div key={s.rollNo} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{s.name.split(" ").map(n => n[0]).join("")}</div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{s.name}</p>
                            <p className="text-xs text-muted-foreground">{s.rollNo} · {s.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${s.attendance >= 75 ? "text-status-success" : "text-status-danger"}`}>{s.attendance}%</p>
                          <p className="text-xs text-muted-foreground">Grade: {s.grade}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subjects;
