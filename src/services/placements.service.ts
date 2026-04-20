import { supabase } from "@/integrations/supabase/client";
import { PlacementDrive } from "@/types";

export async function fetchPlacementDrives(): Promise<PlacementDrive[]> {
  const { data, error } = await (supabase as any)
    .from("placement_drives")
    .select("*, placement_rounds(*)")
    .order("year", { ascending: false })
    .order("created_at", { ascending: false });
  
  if (error) throw new Error(error.message);
  return data as PlacementDrive[];
}

export async function togglePlacementNotification(studentId: string, driveId: string): Promise<void> {
  const { data: existing } = await (supabase as any)
    .from("placement_notifications")
    .select("id")
    .eq("student_id", studentId)
    .eq("drive_id", driveId)
    .maybeSingle();

  if (existing) {
    const { error } = await (supabase as any)
      .from("placement_notifications")
      .delete()
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await (supabase as any)
      .from("placement_notifications")
      .insert([{ student_id: studentId, drive_id: driveId }]);
    if (error) throw new Error(error.message);
  }
}

export async function fetchStudentPlacementNotifications(studentId: string): Promise<string[]> {
  const { data, error } = await (supabase as any)
    .from("placement_notifications")
    .select("drive_id")
    .eq("student_id", studentId);
    
  if (error) throw new Error(error.message);
  return data.map((n: any) => n.drive_id);
}
