import { supabase } from "@/integrations/supabase/client";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target_role: "all" | "student" | "faculty" | "admin";
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const fetchAnnouncements = async (role: string) => {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .or(`target_role.eq.all,target_role.eq.${role},target_role.eq.admin`) // Using 'admin' as fallback to see own
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data as Announcement[];
};

export const createAnnouncement = async (announcement: Omit<Announcement, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase
    .from("announcements")
    .insert(announcement)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteAnnouncement = async (id: string) => {
  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
