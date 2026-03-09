import { feedbackData } from "@/data/mockData";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, Send, MessageSquare, BarChart3 } from "lucide-react";

const statusStyles = {
  pending: { label: "Pending", dot: "⚪", cls: "bg-muted text-muted-foreground" },
  under_review: { label: "Under Review", dot: "🟡", cls: "bg-status-warning/10 text-status-warning" },
  resolved: { label: "Resolved", dot: "🟢", cls: "bg-status-success/10 text-status-success" },
};

const AdminFeedback = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { toast } = useToast();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Feedback Management</h1>
        <p className="text-sm text-muted-foreground">Review and respond to student feedback</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-lg font-bold text-foreground">{feedbackData.length}</p>
          <p className="text-xs text-muted-foreground">Total Feedback</p>
        </div>
        <div className="rounded-xl border border-status-warning/20 bg-status-warning/5 p-4 text-center">
          <p className="text-lg font-bold text-status-warning">{feedbackData.filter(f => f.status !== "resolved").length}</p>
          <p className="text-xs text-muted-foreground">Pending Review</p>
        </div>
        <div className="rounded-xl border border-status-success/20 bg-status-success/5 p-4 text-center">
          <p className="text-lg font-bold text-status-success">{feedbackData.filter(f => f.status === "resolved").length}</p>
          <p className="text-xs text-muted-foreground">Resolved</p>
        </div>
      </div>

      <div className="space-y-3">
        {feedbackData.map((fb) => {
          const status = statusStyles[fb.status];
          return (
            <div key={fb.id} className="rounded-xl border border-border bg-card">
              <button onClick={() => setExpanded(expanded === fb.id ? null : fb.id)} className="w-full p-4 flex items-center justify-between text-left">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{status.dot}</span>
                    <span className="text-xs text-primary font-mono">#{fb.id}</span>
                    <Badge variant="outline" className="text-xs">{fb.category}</Badge>
                    <Badge className={`text-xs ${status.cls}`}>{status.label}</Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground">{fb.title}</p>
                  <p className="text-xs text-muted-foreground">{fb.anonymous ? "Anonymous" : fb.student} · {fb.date} · {fb.priority} priority</p>
                </div>
                {expanded === fb.id ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
              </button>
              {expanded === fb.id && (
                <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                  <p className="text-sm text-foreground">{fb.description}</p>
                  {fb.response && (
                    <div className="rounded-lg bg-status-success/5 border border-status-success/20 p-3">
                      <p className="text-xs font-semibold text-foreground">Previous Response</p>
                      <p className="text-sm text-muted-foreground mt-1">{fb.response}</p>
                    </div>
                  )}
                  <Textarea placeholder="Write your response..." rows={2} className="bg-muted/30" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => toast({ title: "Response sent" })}><Send className="h-3 w-3 mr-1" /> Respond</Button>
                    <Button size="sm" variant="outline" onClick={() => toast({ title: "Marked as resolved" })}>Resolve</Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminFeedback;
