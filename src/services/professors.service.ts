import { supabase } from "@/integrations/supabase/client";
import { Professor } from "@/types";

export const fetchProfessors = async (): Promise<Professor[]> => {
  const { data, error } = await supabase
    .from("professors")
    .select("id,name,designation,designation_short,email,phone,joined,initials,color,research,subjects,lab,profile_url")
    .order("joined");

  if (error) throw error;
  return data as Professor[];
};
