import { useState } from "react";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { useRole } from "@/hooks/useRole";
import { formatDistanceToNow } from "date-fns";
import { Megaphone, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

export function AnnouncementsWidget() {
  const { announcements, isLoading, createAnnouncement, deleteAnnouncement, isCreating } = useAnnouncements();
  const { isAdmin } = useRole();
  const { user } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetRole, setTargetRole] = useState<"all" | "student" | "faculty" | "admin">("all");

  const handleCreate = async () => {
    if (!title.trim() || !content.trim() || !user) return;
    await createAnnouncement({
      title,
      content,
      target_role: targetRole,
      created_by: user.id
    });
    setIsOpen(false);
    setTitle("");
    setContent("");
    setTargetRole("all");
  };

  return (
    <div className="scroll-reveal rounded-xl border border-border bg-card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" /> Announcements
        </h2>
        
        {isAdmin && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Plus className="h-3 w-3" /> New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Post Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Important update..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Details..." rows={4} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Audience</label>
                  <Select value={targetRole} onValueChange={(v: any) => setTargetRole(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Everyone</SelectItem>
                      <SelectItem value="student">Students Only</SelectItem>
                      <SelectItem value="faculty">Faculty Only</SelectItem>
                      <SelectItem value="admin">Admins Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={isCreating || !title.trim() || !content.trim()}>
                  {isCreating ? "Posting..." : "Post Announcement"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 max-h-[300px] pr-2">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="space-y-2 p-3 rounded-lg border border-border">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))
        ) : announcements.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-8">
            <Megaphone className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm">No announcements right now</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="rounded-lg bg-primary/5 border border-primary/10 p-3 relative group">
              <div className="pr-6">
                <h3 className="text-sm font-semibold text-foreground mb-1">{announcement.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2 whitespace-pre-wrap">{announcement.content}</p>
                <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground/70">
                  <span className="capitalize bg-background px-1.5 py-0.5 rounded border border-border">
                    {announcement.target_role}
                  </span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}</span>
                </div>
              </div>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => deleteAnnouncement(announcement.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
