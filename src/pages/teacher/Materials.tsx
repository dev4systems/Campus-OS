import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { teacherSubjects } from "@/data/mockData";
import { Upload, FileText, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const materials = [
  { name: "Lecture 1 - Intro to Trees.pdf", type: "Lecture Notes", subject: "CS301", date: "2026-02-10", downloads: 45 },
  { name: "AVL Rotation Demo.mp4", type: "Video", subject: "CS301", date: "2026-02-15", downloads: 38 },
  { name: "Graph Algorithms Reference.pdf", type: "Lecture Notes", subject: "CS301", date: "2026-03-01", downloads: 52 },
];

const Materials = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Course Materials</h1>
        <p className="text-sm text-muted-foreground">Upload and manage study materials</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="font-semibold text-foreground">Upload Material</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Select><SelectTrigger className="bg-muted/30"><SelectValue placeholder="Subject" /></SelectTrigger>
            <SelectContent>{teacherSubjects.map((s, i) => <SelectItem key={i} value={s.code}>{s.name}</SelectItem>)}</SelectContent>
          </Select>
          <Select><SelectTrigger className="bg-muted/30"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent><SelectItem value="notes">Lecture Notes</SelectItem><SelectItem value="video">Video</SelectItem><SelectItem value="code">Code</SelectItem><SelectItem value="assignment">Assignment</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
          <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
          <p className="text-sm text-muted-foreground">Drop files here</p>
        </div>
        <Button onClick={() => toast({ title: "Material Uploaded" })}>Upload</Button>
      </div>

      <div className="space-y-3">
        {materials.map((m, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.type} · {m.subject} · {m.date} · {m.downloads} downloads</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-status-danger"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Materials;
