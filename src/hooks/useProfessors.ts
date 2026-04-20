import { useQuery } from "@tanstack/react-query";
import { fetchProfessors } from "@/services/professors.service";

export function useProfessors() {
  return useQuery({
    queryKey: ["professors"],
    queryFn: fetchProfessors,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
