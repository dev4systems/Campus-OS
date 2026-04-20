import { BookOpen, Users, Calendar } from "lucide-react";

const courses = [
  { code: "CS301", name: "Data Structures & Algorithms", credits: 4, faculty: "Prof. R. Verma", enrolled: 120, semester: 5 },
  { code: "CS302", name: "Operating Systems", credits: 4, faculty: "Dr. S. Mukherjee", enrolled: 118, semester: 5 },
  { code: "CS303", name: "Computer Networks", credits: 3, faculty: "Dr. A. Das", enrolled: 115, semester: 5 },
  { code: "CS501", name: "Machine Learning", credits: 4, faculty: "Prof. R. Verma", enrolled: 45, semester: 7 },
  { code: "EE201", name: "Circuit Theory", credits: 3, faculty: "Dr. M. Paul", enrolled: 95, semester: 3 },
  { code: "ME301", name: "Thermodynamics", credits: 4, faculty: "Prof. K. Roy", enrolled: 88, semester: 5 },
];

const AcademicMgmt = () => {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Academic Management</h1>
        <p className="text-sm text-muted-foreground">Manage courses, semesters & faculty assignments</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="scroll-reveal rounded-xl border border-border bg-card p-4 text-center">
          <Calendar className="h-6 w-6 mx-auto text-primary mb-1" />
          <p className="text-lg font-bold text-foreground">Spring 2026</p>
          <p className="text-xs text-muted-foreground">Current Semester</p>
        </div>
        <div className="scroll-reveal rounded-xl border border-border bg-card p-4 text-center" style={{ transitionDelay: "70ms" }}>
          <BookOpen className="h-6 w-6 mx-auto text-primary mb-1" />
          <p className="text-lg font-bold text-foreground">{courses.length}</p>
          <p className="text-xs text-muted-foreground">Active Courses</p>
        </div>
        <div className="scroll-reveal rounded-xl border border-border bg-card p-4 text-center" style={{ transitionDelay: "140ms" }}>
          <Users className="h-6 w-6 mx-auto text-primary mb-1" />
          <p className="text-lg font-bold text-foreground">{courses.reduce((s, c) => s + c.enrolled, 0)}</p>
          <p className="text-xs text-muted-foreground">Total Enrollments</p>
        </div>
      </div>

      <div className="scroll-reveal rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_80px_80px] gap-4 p-4 border-b border-border text-xs font-semibold text-muted-foreground uppercase">
          <span>Course</span><span>Faculty</span><span>Credits</span><span>Enrolled</span>
        </div>
        <div className="divide-y divide-border">
          {courses.map((c) => (
            <div key={c.code} className="grid grid-cols-[1fr_1fr_80px_80px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.code} · Sem {c.semester}</p>
              </div>
              <span className="text-sm text-muted-foreground">{c.faculty}</span>
              <span className="text-sm text-foreground font-medium text-center">{c.credits}</span>
              <span className="text-sm text-foreground font-medium text-center">{c.enrolled}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademicMgmt;
