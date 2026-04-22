import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Bug, Send } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const pages = ["Home", "Dashboard", "Timetable", "Campus Buzz", "Map", "Feedback", "Other"];
const severities = [
  { value: "minor", label: "🟢 Minor", desc: "Cosmetic or low-impact" },
  { value: "moderate", label: "🟡 Moderate", desc: "Feature partially broken" },
  { value: "critical", label: "🔴 Critical", desc: "App crash or data loss" },
] as const;

const bugReportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  page_section: z.string().min(1, "Please select a page or section"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  severity: z.enum(["minor", "moderate", "critical"]),
  contact_email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

type BugReportFormValues = z.infer<typeof bugReportSchema>;

const BugReportWidget = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<BugReportFormValues>({
    resolver: zodResolver(bugReportSchema),
    defaultValues: {
      title: "",
      page_section: "",
      description: "",
      severity: "minor",
      contact_email: "",
    },
  });

  const onSubmit = async (data: BugReportFormValues) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("bug_reports" as any).insert({
        title: data.title.trim(),
        page_section: data.page_section,
        description: data.description.trim(),
        severity: data.severity,
        contact_email: data.contact_email?.trim() || null,
        user_id: user?.id || null,
      } as any);

      if (error) throw error;

      toast({ title: "✅ Bug reported!", description: "Our dev team will look into it." });
      form.reset();
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Short description of the issue" className="bg-card h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="page_section"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-card h-12">
                          <SelectValue placeholder="Page / Section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pages.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="your@email.com — we'll update you when fixed" className="bg-card h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Describe what happened, what you expected, and steps to reproduce..." rows={4} className="bg-card" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-foreground">Severity</FormLabel>
                  <div className="flex gap-3 flex-wrap">
                    {severities.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => field.onChange(s.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                          field.value === s.value
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-card text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={submitting}>
              <Send className="h-4 w-4 mr-2" />
              {submitting ? "Submitting..." : "Submit Bug Report"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BugReportWidget;
