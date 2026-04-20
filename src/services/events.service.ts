import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types";

export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await (supabase as any).from("events").select("*");
  if (error) throw new Error(error.message);
  return data as Event[];
}
