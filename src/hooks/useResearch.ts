import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchResearchProjects, createCollaborationRequest, fetchProfessorRequests, updateRequestStatus } from "@/services/research.service";
import { CollaborationRequest } from "@/types";

export function useResearchProjects() {
  return useQuery({
    queryKey: ["research-projects"],
    queryFn: fetchResearchProjects,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCollaborationRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: Partial<CollaborationRequest>) => createCollaborationRequest(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaboration-requests"] });
    },
  });
}

export function useProfessorRequests(email?: string) {
  return useQuery({
    queryKey: ["professor-requests", email],
    queryFn: () => fetchProfessorRequests(email!),
    enabled: !!email,
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'accepted' | 'rejected' }) => updateRequestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professor-requests"] });
    },
  });
}
