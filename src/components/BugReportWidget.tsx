import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Bug, Send } from "lucide-react";

const pages = ["Home", "Dashboard", "Timetable", "Campus Buzz", "Map", "Feedback", "Other"];
const severities = [
  { value: "minor", label: "🟢 Minor", desc: "Cosmetic or low-impact" },
  { value: "moderate", label: "🟡 Moderate", desc: "Feature partially broken" },
  { value: "critical", label: "🔴 Critical", desc: "App crash or data loss" },
];

const BugReportWidget = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [page, setPage] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("minor");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !page || !description.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("bug_reports" as any).insert({
        title: title.trim(),
        page_section: page,
        description: description.trim(),
        severity,
        contact_email: email.trim() || null,
        user_id: user?.id || null,
      } as any);

      if (error) throw error;

      toast({ title: "✅ Bug reported!", description: "Our dev team will look into it." });
      setTitle(""); setPage(""); setDescription(""); setSeverity("minor"); setEmail("");
    } catch {
      toast({ title: "Failed to submit", description: "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-8 border-t border-border">
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Bug className="h-5 w-5 text-destructive" />
          <h2 className="text-lg font-semibold text-foreground">Found a Bug? Help Us Improve 🐛</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Report issues directly to the dev team. Every report helps us build a better Campus Companion.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Short description of the issue"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="bg-card h-12"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Select value={page} onValueChange={setPage} required>
              <SelectTrigger className="bg-card h-12">
                <SelectValue placeholder="Page / Section" />
              </SelectTrigger>
              <SelectContent>
                {pages.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="email"
              placeholder="your@email.com — we'll update you when fixed"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-card h-12"
            />
          </div>

          <Textarea
            placeholder="Describe what happened, what you expected, and steps to reproduce..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="bg-card"
          />

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Severity</p>
            <div className="flex gap-3 flex-wrap">
              {severities.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSeverity(s.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                    severity === s.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={submitting || !title.trim() || !page || !description.trim()}>
            <Send className="h-4 w-4 mr-2" />
            {submitting ? "Submitting..." : "Submit Bug Report"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BugReportWidget;
