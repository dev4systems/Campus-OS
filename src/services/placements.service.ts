import { supabase } from "@/integrations/supabase/client";
import { Placement } from "@/types";

export async function fetchPlacements(): Promise<Placement[]> {
  const { data, error } = await (supabase as any).from("placements").select("*");
  if (error) throw new Error(error.message);
  return data as Placement[];
}
