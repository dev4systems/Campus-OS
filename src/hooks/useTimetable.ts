import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTimetableSlots, upsertTimetableSlot, TimetableSlotRecord } from "@/services/timetable.service";

export function useTimetable(department?: string, semester?: number, section?: string) {
  return useQuery({
    queryKey: ["timetable", department, semester, section],
    queryFn: () => fetchTimetableSlots(department!, semester!, section!),
    enabled: !!(department && semester && section),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpsertTimetableSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slot: TimetableSlotRecord) => upsertTimetableSlot(slot),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["timetable", variables.department, variables.semester, variables.section] });
    },
  });
}
