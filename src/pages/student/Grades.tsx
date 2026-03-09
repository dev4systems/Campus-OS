import { gradesData } from "@/data/mockData";
import { Trophy } from "lucide-react";

const Grades = () => {
  const cgpa = gradesData.semesterGPAs[gradesData.semesterGPAs.length - 1].gpa;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Grades</h1>
        <p className="text-sm text-muted-foreground">Academic performance overview</p>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 flex items-center gap-5">
        <div className="h-20 w-20 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center">
          <span className="text-2xl font-bold text-primary">{cgpa}</span>
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">Current CGPA</p>
          <p className="text-sm text-muted-foreground">Semester 5 · {gradesData.current.length} courses</p>
        </div>
      </div>

      {/* GPA Trend */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Trophy className="h-4 w-4 text-nexus-amber" /> GPA Progression</h2>
        <div className="flex items-end gap-3 h-32">
          {gradesData.semesterGPAs.map((sem) => (
            <div key={sem.sem} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-foreground">{sem.gpa}</span>
              <div className="w-full rounded-t-md bg-primary/20 relative" style={{ height: `${((sem.gpa - 7) / 3) * 100}%` }}>
                <div className="absolute inset-0 rounded-t-md bg-primary" style={{ opacity: sem.sem === gradesData.semesterGPAs.length ? 1 : 0.5 }} />
              </div>
              <span className="text-[10px] text-muted-foreground">Sem {sem.sem}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Semester Grades */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Current Semester</h2>
        </div>
        <div className="divide-y divide-border">
          {gradesData.current.map((course) => (
            <div key={course.code} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{course.subject}</p>
                <p className="text-xs text-muted-foreground">{course.code} · Class avg: {course.classAvg}%</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{course.grade}</p>
                <p className="text-xs text-muted-foreground">{course.score}/{course.maxScore}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Grades;
