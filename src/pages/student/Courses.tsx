import { useAuth } from "@/contexts/AuthContext";
import { useSubjects, mockCourses } from "@/hooks/useStudentData";
import { BookOpen, User, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Courses = () => {
  const { user } = useAuth();
  const isDemo = !!user?.isDemo;
  const semester = user?.semester || 5;
  const { data: realSubjects, isLoading } = useSubjects(user?.id, semester, isDemo);

  const coursesList = isDemo
    ? mockCourses
    : (realSubjects || []).map(s => ({
        code: s.code,
        name: s.name,
        credits: s.credits,
        professor: s.professor,
        office: s.office,
      }));

  const loading = !isDemo && isLoading;
  const totalCredits = coursesList.reduce((s, c) => s + c.credits, 0);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Courses & Syllabus</h1>
        <p className="text-sm text-muted-foreground">Semester {semester} — {coursesList.length} courses, {totalCredits} credits</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : coursesList.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          No courses found for this semester.
        </div>
      ) : (
        <div className="space-y-3">
          {coursesList.map((course, i) => (
            <div key={course.code} className="scroll-reveal rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors" style={{ transitionDelay: `${i * 70}ms` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">{course.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{course.code} · {course.credits} Credits</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {course.professor && <span className="flex items-center gap-1"><User className="h-4 w-4" /> {course.professor}</span>}
                    {course.office && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Office: {course.office}</span>}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs shrink-0"><Download className="h-4 w-4 mr-1" /> Syllabus</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
