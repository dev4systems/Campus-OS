import { useState } from "react";
import { teacherStudents, teacherSubjects } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

const MarkAttendance = () => {
  const [subject, setSubject] = useState("");
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const toggleStudent = (rollNo: string) => {
    setAttendance((prev) => ({ ...prev, [rollNo]: !prev[rollNo] }));
  };

  const markAll = (present: boolean) => {
    const all: Record<string, boolean> = {};
    teacherStudents.forEach((s) => { all[s.rollNo] = present; });
    setAttendance(all);
  };

  const handleSubmit = () => {
    const presentCount = Object.values(attendance).filter(Boolean).length;
    toast({ title: "Attendance Submitted", description: `${presentCount}/${teacherStudents.length} marked present for ${subject || "selected subject"}.` });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mark Attendance</h1>
        <p className="text-sm text-muted-foreground">Select subject and mark student attendance</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Select onValueChange={setSubject}>
          <SelectTrigger className="bg-card"><SelectValue placeholder="Select Subject" /></SelectTrigger>
          <SelectContent>
            {teacherSubjects.map((s, i) => (
              <SelectItem key={i} value={`${s.code}-${s.section}`}>{s.name} (Sec {s.section})</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => markAll(true)} className="flex-1">Mark All Present</Button>
          <Button variant="outline" size="sm" onClick={() => markAll(false)} className="flex-1">Mark All Absent</Button>
        </div>
      </div>

      <div className="scroll-reveal rounded-xl border border-border bg-card overflow-hidden">
        <div className="divide-y divide-border">
          {teacherStudents.map((student) => (
            <label key={student.rollNo} className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <Checkbox checked={attendance[student.rollNo] || false} onCheckedChange={() => toggleStudent(student.rollNo)} />
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{student.name.split(" ").map(n => n[0]).join("")}</div>
                <div>
                  <p className="text-sm font-medium text-foreground">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.rollNo}</p>
                </div>
              </div>
              {attendance[student.rollNo] && <CheckCircle2 className="h-5 w-5 text-status-success" />}
            </label>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full sm:w-auto">Submit Attendance</Button>
    </div>
  );
};

export default MarkAttendance;
