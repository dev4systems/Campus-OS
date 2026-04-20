import { useQuery } from "@tanstack/react-query";
import { fetchPlacements } from "@/services/placements.service";

export function usePlacements() {
  return useQuery({
    queryKey: ["placements"],
    queryFn: fetchPlacements,
    staleTime: 10 * 60 * 1000,
  });
}
