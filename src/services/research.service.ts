import { supabase } from "@/integrations/supabase/client";
import { ResearchProject, CollaborationRequest } from "@/types";

export async function fetchResearchProjects(): Promise<ResearchProject[]> {
  const { data, error } = await (supabase as any)
    .from("research_projects")
    .select("*, professors(*)")
    .order("created_at", { ascending: false });
  
  if (error) throw new Error(error.message);
  return data as ResearchProject[];
}

export async function createCollaborationRequest(request: Partial<CollaborationRequest>): Promise<void> {
  const { error } = await (supabase as any)
    .from("collaboration_requests")
    .insert([request]);
    
  if (error) throw new Error(error.message);
}

export async function fetchProfessorRequests(professorEmail: string): Promise<CollaborationRequest[]> {
  // First find the professor_id (TEXT id from professors table)
  const { data: prof } = await (supabase as any)
    .from("professors")
    .select("id")
    .eq("email", professorEmail)
    .single();
    
  if (!prof) return [];

  const { data, error } = await (supabase as any)
    .from("collaboration_requests")
    .select("*, profiles!student_id(*), research_projects!project_id(*)")
    .eq("research_projects.professor_id", prof.id);
    
  if (error) throw new Error(error.message);
  return data as CollaborationRequest[];
}

export async function updateRequestStatus(requestId: string, status: 'accepted' | 'rejected'): Promise<void> {
  const { error } = await (supabase as any)
    .from("collaboration_requests")
    .update({ status })
    .eq("id", requestId);
    
  if (error) throw new Error(error.message);
}
