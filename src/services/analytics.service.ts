import { supabase } from "@/integrations/supabase/client";

export async function fetchDAU() {
  const { data, error } = await (supabase as any).from("analytics_dau").select("*");
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchFeatureUsage() {
  const { data, error } = await (supabase as any).from("analytics_feature_usage").select("*");
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchAttendanceHealth() {
  const { data, error } = await (supabase as any).from("analytics_attendance_health").select("*");
  if (error) throw new Error(error.message);
  return data;
}

export async function fetchPlacementFunnel() {
  const { data, error } = await (supabase as any).from("analytics_placement_funnel").select("*");
  if (error) throw new Error(error.message);
  return data;
}

export async function trackPageView(userId: string, path: string, feature?: string) {
  const { error } = await (supabase as any).from("page_views").insert([{ user_id: userId, path, feature }]);
  if (error) console.error("Tracking error:", error);
}
