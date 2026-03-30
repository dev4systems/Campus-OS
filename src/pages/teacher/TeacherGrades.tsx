import { teacherStudents, teacherSubjects } from "@/data/mockData";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const TeacherGrades = () => {
  const [grades, setGrades] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const updateGrade = (rollNo: string, value: string) => {
    setGrades((prev) => ({ ...prev, [rollNo]: value }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Grades Management</h1>
        <p className="text-sm text-muted-foreground">Enter and submit student grades</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Select><SelectTrigger className="bg-card"><SelectValue placeholder="Select Subject" /></SelectTrigger>
          <SelectContent>{teacherSubjects.map((s, i) => <SelectItem key={i} value={`${s.code}-${s.section}`}>{s.name} (Sec {s.section})</SelectItem>)}</SelectContent>
        </Select>
        <Select><SelectTrigger className="bg-card"><SelectValue placeholder="Exam Type" /></SelectTrigger>
          <SelectContent><SelectItem value="mid">Mid Semester</SelectItem><SelectItem value="end">End Semester</SelectItem><SelectItem value="quiz">Quiz</SelectItem></SelectContent>
        </Select>
      </div>

      <div className="scroll-reveal rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_100px_100px_80px] gap-4 p-4 border-b border-border text-xs font-semibold text-muted-foreground uppercase">
          <span>Student</span>
          <span className="hidden sm:block">Roll No</span>
          <span>Marks</span>
          <span>Grade</span>
        </div>
        <div className="divide-y divide-border">
          {teacherStudents.map((s) => {
            const marks = parseInt(grades[s.rollNo] || "0");
            const grade = marks >= 90 ? "A+" : marks >= 80 ? "A" : marks >= 70 ? "B+" : marks >= 60 ? "B" : marks >= 50 ? "C" : "F";
            return (
              <div key={s.rollNo} className="grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_100px_100px_80px] gap-4 p-4 items-center">
                <div>
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground sm:hidden">{s.rollNo}</p>
                </div>
                <span className="text-sm text-muted-foreground hidden sm:block">{s.rollNo}</span>
                <Input type="number" max={100} min={0} placeholder="0" className="bg-muted/30 h-8 text-sm" value={grades[s.rollNo] || ""} onChange={(e) => updateGrade(s.rollNo, e.target.value)} />
                <span className="text-sm font-bold text-primary">{grades[s.rollNo] ? grade : "—"}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Button onClick={() => toast({ title: "Grades Submitted", description: "Students will be notified." })}>Submit Grades</Button>
    </div>
  );
};

export default TeacherGrades;
