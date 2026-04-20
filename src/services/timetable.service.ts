import { supabase } from "@/integrations/supabase/client";

export interface TimetableSlotRecord {
  id?: string;
  department: string;
  semester: number;
  section: string;
  day_of_week: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  slot_number: number;
  subject_name: string;
  subject_code: string;
  faculty_id: string | null;
  room: string | null;
  status?: 'draft' | 'published';
  profiles?: { full_name: string };
}

export async function fetchTimetableSlots(
  department: string,
  semester: number,
  section: string
): Promise<TimetableSlotRecord[]> {
  const { data, error } = await (supabase as any)
    .from("timetable_slots")
    .select("*, profiles:faculty_id(full_name)")
    .eq("department", department)
    .eq("semester", semester)
    .eq("section", section);
  
  if (error) throw new Error(error.message);
  return data as TimetableSlotRecord[];
}

export async function upsertTimetableSlot(slot: TimetableSlotRecord): Promise<void> {
  const { error } = await (supabase as any)
    .from("timetable_slots")
    .upsert(slot, { onConflict: 'department,semester,section,day_of_week,slot_number' });
    
  if (error) throw new Error(error.message);
}

export async function checkFacultyConflict(facultyId: string, day: string, slot: number, excludeId?: string) {
  let query = (supabase as any)
    .from("timetable_slots")
    .select("id, subject_name, department, semester, section")
    .eq("faculty_id", facultyId)
    .eq("day_of_week", day)
    .eq("slot_number", slot);
    
  if (excludeId) {
    query = query.neq("id", excludeId);
  }
  
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}
