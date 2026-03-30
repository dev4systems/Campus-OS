import { adminComplaints } from "@/data/mockData";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, Send } from "lucide-react";

const statusStyles = {
  pending: "bg-muted text-muted-foreground",
  under_review: "bg-status-warning/10 text-status-warning border-status-warning/20",
  resolved: "bg-status-success/10 text-status-success border-status-success/20",
};

const Complaints = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { toast } = useToast();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Complaint Management</h1>
        <p className="text-sm text-muted-foreground">{adminComplaints.length} complaints · {adminComplaints.filter(c => c.status === "pending").length} pending</p>
      </div>

      <div className="space-y-3">
        {adminComplaints.map((c, i) => (
          <div key={c.id} className="scroll-reveal rounded-xl border border-border bg-card" style={{ transitionDelay: `${i * 70}ms` }}>
            <button onClick={() => setExpanded(expanded === c.id ? null : c.id)} className="w-full p-4 flex items-center justify-between text-left">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-primary">{c.id}</span>
                  <Badge variant="outline" className="text-xs">{c.category}</Badge>
                  <Badge className={`text-xs ${statusStyles[c.status]}`}>{c.status.replace("_", " ")}</Badge>
                </div>
                <p className="text-sm text-foreground">{c.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.from} · {c.date} · Assigned: {c.assignedTo}</p>
              </div>
              {expanded === c.id ? <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />}
            </button>
            {expanded === c.id && (
              <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                <Textarea placeholder="Add response or note..." rows={2} className="bg-muted/30" />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => toast({ title: "Response sent" })}><Send className="h-4 w-4 mr-1" /> Respond</Button>
                  <Button size="sm" variant="outline" onClick={() => toast({ title: "Status updated" })}>Mark Resolved</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Complaints;
