import { teacherSubjects } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Clock, AlertCircle } from "lucide-react";

const Syllabus = () => {
  const { toast } = useToast();
  const deadlines = [
    { type: "Mid Semester", date: "2026-03-18", daysLeft: 9 },
    { type: "End Semester", date: "2026-05-01", daysLeft: 53 },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Syllabus Upload</h1>
        <p className="text-sm text-muted-foreground">Upload exam syllabus before deadlines</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {deadlines.map((d, i) => (
          <div key={d.type} className={`scroll-reveal rounded-xl border p-4 ${d.daysLeft <= 7 ? "border-status-danger/20 bg-status-danger/5" : "border-status-warning/20 bg-status-warning/5"}`} style={{ transitionDelay: `${i * 70}ms` }}>
            <div className="flex items-center gap-2 mb-1">
              {d.daysLeft <= 7 ? <AlertCircle className="h-5 w-5 text-status-danger" /> : <Clock className="h-5 w-5 text-status-warning" />}
              <span className="text-sm font-semibold text-foreground">{d.type} Deadline</span>
            </div>
            <p className="text-xs text-muted-foreground">{d.date} · {d.daysLeft} days left</p>
          </div>
        ))}
      </div>

      <div className="scroll-reveal rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="font-semibold text-foreground">Upload Syllabus</h2>
        <Select><SelectTrigger className="bg-muted/30"><SelectValue placeholder="Select Subject" /></SelectTrigger>
          <SelectContent>{teacherSubjects.map((s, i) => <SelectItem key={i} value={`${s.code}-${s.section}`}>{s.name} (Sec {s.section})</SelectItem>)}</SelectContent>
        </Select>
        <Select><SelectTrigger className="bg-muted/30"><SelectValue placeholder="Exam Type" /></SelectTrigger>
          <SelectContent><SelectItem value="mid">Mid Semester</SelectItem><SelectItem value="end">End Semester</SelectItem></SelectContent>
        </Select>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
          <p className="text-xs text-muted-foreground">PDF, DOC up to 10MB</p>
        </div>
        <Button onClick={() => toast({ title: "Syllabus Uploaded", description: "Students will be notified." })}>Upload & Publish</Button>
      </div>
    </div>
  );
};

export default Syllabus;
