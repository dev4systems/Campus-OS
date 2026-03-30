import { useState } from "react";
import { feedbackData } from "@/data/mockData";
import BugReportWidget from "@/components/BugReportWidget";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";

const statusConfig = {
  pending: { label: "Pending", dot: "⚪" },
  under_review: { label: "Under Review", dot: "🟡" },
  resolved: { label: "Resolved", dot: "🟢" },
};

const Feedback = () => {
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const filtered = filter === "all" ? feedbackData : feedbackData.filter((f) => f.status === filter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Feedback Submitted", description: "Your feedback has been recorded. Track status in 'My Feedback'." });
    setShowForm(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feedback & Suggestions</h1>
          <p className="text-sm text-muted-foreground">Share your thoughts and track responses</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm"><Plus className="h-5 w-5 mr-1" /> New Feedback</Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="scroll-reveal rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-4">
          <h2 className="font-semibold text-foreground">✏️ Submit Feedback</h2>
          <Input placeholder="Title (brief description)" required className="bg-card" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select><SelectTrigger className="bg-card"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent><SelectItem value="academic">Academic</SelectItem><SelectItem value="infrastructure">Infrastructure</SelectItem><SelectItem value="experience">Campus Experience</SelectItem><SelectItem value="services">Services</SelectItem><SelectItem value="general">General</SelectItem></SelectContent>
            </Select>
            <Select><SelectTrigger className="bg-card"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
            </Select>
          </div>
          <Textarea placeholder="Detailed description..." rows={4} required className="bg-card" />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"><Checkbox /> Anonymous submission</label>
            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </form>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["all", "pending", "under_review", "resolved"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
            {f === "under_review" ? "Under Review" : f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((fb, i) => {
          const status = statusConfig[fb.status];
          return (
            <div key={fb.id} className="scroll-reveal rounded-xl border border-border bg-card" style={{ transitionDelay: `${i * 70}ms` }}>
              <button onClick={() => setExpanded(expanded === fb.id ? null : fb.id)} className="w-full p-4 flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <span>{status.dot}</span>
                  <div>
                    <p className="font-medium text-foreground">{fb.title}</p>
                    <p className="text-xs text-muted-foreground">{fb.category} · {fb.date} · #{fb.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs capitalize">{fb.priority}</Badge>
                  {expanded === fb.id ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </div>
              </button>
              {expanded === fb.id && (
                <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                  <p className="text-sm text-foreground">{fb.description}</p>
                  {fb.response && (
                    <div className="rounded-lg bg-status-success/5 border border-status-success/20 p-3">
                      <p className="text-xs font-semibold text-foreground flex items-center gap-1"><MessageSquare className="h-4 w-4" /> Admin Response</p>
                      <p className="text-sm text-muted-foreground mt-1">{fb.response}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <BugReportWidget />
    </div>
  );
};

export default Feedback;
