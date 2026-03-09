import { coursesData } from "@/data/mockData";
import { BookOpen, User, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Courses = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Courses & Syllabus</h1>
        <p className="text-sm text-muted-foreground">Semester 5 — {coursesData.length} courses, {coursesData.reduce((s, c) => s + c.credits, 0)} credits</p>
      </div>

      <div className="space-y-3">
        {coursesData.map((course) => (
          <div key={course.code} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-foreground">{course.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{course.code} · {course.credits} Credits</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {course.professor}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Office: {course.office}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs shrink-0"><Download className="h-3 w-3 mr-1" /> Syllabus</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
