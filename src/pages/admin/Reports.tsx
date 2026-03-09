import { BarChart3, Download, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Reports = () => {
  const reportTypes = [
    { name: "Grade Distribution", desc: "Department-wise grade analytics", category: "Academic" },
    { name: "Attendance Trends", desc: "Monthly attendance patterns across departments", category: "Academic" },
    { name: "Fee Collection", desc: "Semester-wise fee collection summary", category: "Finance" },
    { name: "Complaint Resolution", desc: "Average resolution time and category breakdown", category: "Admin" },
    { name: "User Activity", desc: "Login frequency and active users", category: "System" },
    { name: "Exam Performance", desc: "Subject-wise pass rates and averages", category: "Academic" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground">Generate and export institutional reports</p>
      </div>

      <div className="flex gap-3">
        <Select><SelectTrigger className="w-[160px] bg-muted/50"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="academic">Academic</SelectItem><SelectItem value="finance">Finance</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent>
        </Select>
        <Select><SelectTrigger className="w-[160px] bg-muted/50"><SelectValue placeholder="Format" /></SelectTrigger>
          <SelectContent><SelectItem value="pdf">PDF</SelectItem><SelectItem value="csv">CSV</SelectItem></SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {reportTypes.map((r, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><FileBarChart className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-sm font-medium text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.desc} · {r.category}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs"><Download className="h-3 w-3 mr-1" /> Generate</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
