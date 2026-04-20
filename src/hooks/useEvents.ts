import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/services/events.service";

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 2 * 60 * 1000,
  });
}
