import { supabase } from "@/integrations/supabase/client";
import { Attendance } from "@/types";

export async function fetchAttendance(userId: string): Promise<Attendance[]> {
  const { data, error } = await supabase
    .from("attendance")
    .select("*, subjects(code, name)")
    .eq("user_id", userId);
  
  if (error) throw new Error(error.message);
  return data as Attendance[];
}
