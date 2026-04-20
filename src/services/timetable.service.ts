import { supabase } from "@/integrations/supabase/client";
import { TimetableDay } from "@/types";

export async function fetchTimetableSlots(
  department: string,
  semester: number,
  _section: string
): Promise<TimetableDay[]> {
  const { data, error } = await (supabase as any)
    .from("timetable")
    .select("data")
    .eq("department", department)
    .eq("semester", semester)
    .single();
  
  if (error) throw new Error(error.message);
  return data.data as TimetableDay[];
}
