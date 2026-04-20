import { useQuery } from "@tanstack/react-query";
import { fetchTimetableSlots } from "@/services/timetable.service";

export function useTimetable(department?: string, semester?: number, section?: string) {
  return useQuery({
    queryKey: ["timetable", department, semester, section],
    queryFn: () => fetchTimetableSlots(department!, semester!, section!),
    enabled: !!(department && semester && section),
  });
}
