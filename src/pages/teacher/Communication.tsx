import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { teacherSubjects } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Send, Megaphone } from "lucide-react";

const announcements = [
  { subject: "CS301-A", message: "Mid-semester exam will cover chapters 1-8. Focus on AVL trees and graph algorithms.", date: "2026-03-07", views: 48 },
  { subject: "CS501-A", message: "Project proposal submission deadline extended to March 20.", date: "2026-03-05", views: 32 },
];

const Communication = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Communication</h1>
        <p className="text-sm text-muted-foreground">Send announcements and messages</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2"><Megaphone className="h-4 w-4 text-primary" /> New Announcement</h2>
        <Select><SelectTrigger className="bg-muted/30"><SelectValue placeholder="Select Subject/Section" /></SelectTrigger>
          <SelectContent>{teacherSubjects.map((s, i) => <SelectItem key={i} value={`${s.code}-${s.section}`}>{s.name} (Sec {s.section})</SelectItem>)}</SelectContent>
        </Select>
        <Textarea placeholder="Type your announcement..." value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="bg-muted/30" />
        <Button onClick={() => { toast({ title: "Announcement Sent" }); setMessage(""); }}>
          <Send className="h-4 w-4 mr-1" /> Send
        </Button>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Recent Announcements</h2>
        <div className="space-y-3">
          {announcements.map((a, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-primary">{a.subject}</span>
                <span className="text-xs text-muted-foreground">{a.date} · {a.views} views</span>
              </div>
              <p className="text-sm text-foreground">{a.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Communication;
