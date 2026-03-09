import { useState } from "react";
import { assignmentsData } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Upload, Download, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, className: "bg-status-warning/10 text-status-warning border-status-warning/20" },
  submitted: { label: "Submitted", icon: CheckCircle2, className: "bg-status-success/10 text-status-success border-status-success/20" },
  overdue: { label: "Overdue", icon: XCircle, className: "bg-status-danger/10 text-status-danger border-status-danger/20" },
};

const Assignments = () => {
  const [filter, setFilter] = useState<"all" | "pending" | "submitted" | "overdue">("all");
  const filtered = filter === "all" ? assignmentsData : assignmentsData.filter((a) => a.status === filter);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
        <p className="text-sm text-muted-foreground">Track and submit your assignments</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(["all", "pending", "submitted", "overdue"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
            {f} {f !== "all" && `(${assignmentsData.filter((a) => a.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((assignment) => {
          const status = statusConfig[assignment.status];
          const StatusIcon = status.icon;
          const daysLeft = Math.ceil((new Date(assignment.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          return (
            <div key={assignment.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">{assignment.subject}</Badge>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${status.className}`}>
                      <StatusIcon className="h-3 w-3" /> {status.label}
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                  <p className="text-sm text-muted-foreground">{assignment.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Prof. {assignment.professor} · Due: {assignment.dueDate}
                    {assignment.status === "pending" && daysLeft > 0 && ` (${daysLeft} days left)`}
                  </p>
                  {assignment.grade && (
                    <div className="mt-2 rounded-lg bg-status-success/5 border border-status-success/20 p-3">
                      <p className="text-sm font-medium text-foreground">Grade: {assignment.grade}</p>
                      <p className="text-xs text-muted-foreground mt-1">{assignment.feedback}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="text-xs"><Download className="h-3 w-3 mr-1" /> PDF</Button>
                  {assignment.status !== "submitted" && (
                    <Button size="sm" className="text-xs"><Upload className="h-3 w-3 mr-1" /> Submit</Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Assignments;
