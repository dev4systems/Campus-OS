import { supabase } from "@/integrations/supabase/client";
import { BugReport } from "@/types";

export async function createBugReport(report: BugReport): Promise<BugReport> {
  const { data, error } = await (supabase as any)
    .from("bug_reports")
    .insert([report])
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return data as BugReport;
}
