import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { teacherSubjects } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Plus, FileText, Eye, Download } from "lucide-react";

const TeacherAssignments = () => {
  const [showCreate, setShowCreate] = useState(false);
  const { toast } = useToast();

  const existingAssignments = [
    { title: "Binary Tree Implementation", subject: "CS301-A", submissions: 48, total: 62, dueDate: "2026-03-15", graded: 12 },
    { title: "Process Scheduling Simulator", subject: "CS301-B", submissions: 35, total: 58, dueDate: "2026-03-12", graded: 0 },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-sm text-muted-foreground">Create and manage assignments</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)} size="sm"><Plus className="h-4 w-4 mr-1" /> Create</Button>
      </div>

      {showCreate && (
        <form onSubmit={(e) => { e.preventDefault(); toast({ title: "Assignment Created" }); setShowCreate(false); }} className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-4">
          <h2 className="font-semibold text-foreground">New Assignment</h2>
          <Input placeholder="Assignment Title" required className="bg-card" />
          <Select><SelectTrigger className="bg-card"><SelectValue placeholder="Subject & Section" /></SelectTrigger>
            <SelectContent>{teacherSubjects.map((s, i) => <SelectItem key={i} value={`${s.code}-${s.section}`}>{s.name} (Sec {s.section})</SelectItem>)}</SelectContent>
          </Select>
          <Textarea placeholder="Instructions & description..." rows={3} className="bg-card" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input type="date" className="bg-card" />
            <Input type="number" placeholder="Max Marks" className="bg-card" />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit">Publish</Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {existingAssignments.map((a, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">{a.title}</h3>
                <p className="text-xs text-muted-foreground">{a.subject} · Due: {a.dueDate}</p>
                <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                  <span>Submissions: <span className="font-medium text-foreground">{a.submissions}/{a.total}</span></span>
                  <span>Graded: <span className="font-medium text-foreground">{a.graded}/{a.submissions}</span></span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs"><Eye className="h-3 w-3 mr-1" /> View</Button>
                <Button size="sm" className="text-xs"><FileText className="h-3 w-3 mr-1" /> Grade</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherAssignments;
