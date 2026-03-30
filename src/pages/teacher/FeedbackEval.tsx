import { teacherStudents } from "@/data/mockData";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const FeedbackEval = () => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState("");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Feedback & Evaluation</h1>
        <p className="text-sm text-muted-foreground">Give feedback to students</p>
      </div>

      <div className="scroll-reveal rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="font-semibold text-foreground">Individual Feedback</h2>
        <Select><SelectTrigger className="bg-muted/30"><SelectValue placeholder="Select Student" /></SelectTrigger>
          <SelectContent>{teacherStudents.map((s) => <SelectItem key={s.rollNo} value={s.rollNo}>{s.name} ({s.rollNo})</SelectItem>)}</SelectContent>
        </Select>
        <Textarea placeholder="Write your feedback..." value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} className="bg-muted/30" />
        <Button onClick={() => { toast({ title: "Feedback Sent" }); setFeedback(""); }}>Send Feedback</Button>
      </div>

      <div className="scroll-reveal rounded-xl border border-border bg-card p-5" style={{ transitionDelay: "70ms" }}>
        <h2 className="font-semibold text-foreground mb-4">Class Performance Summary</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-lg font-bold text-foreground">82%</p>
            <p className="text-xs text-muted-foreground">Avg Attendance</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-lg font-bold text-foreground">B+</p>
            <p className="text-xs text-muted-foreground">Avg Grade</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-lg font-bold text-foreground">78%</p>
            <p className="text-xs text-muted-foreground">Assignment Completion</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Top Performers</p>
          {teacherStudents.filter((s) => s.attendance >= 88).map((s) => (
            <div key={s.rollNo} className="flex items-center justify-between rounded-lg bg-status-success/5 border border-status-success/20 p-3">
              <span className="text-sm font-medium text-foreground">{s.name}</span>
              <span className="text-sm font-bold text-status-success">{s.grade}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackEval;
