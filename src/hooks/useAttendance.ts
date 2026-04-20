import { useQuery } from "@tanstack/react-query";
import { fetchAttendance } from "@/services/attendance.service";

export function useAttendance(userId?: string) {
  return useQuery({
    queryKey: ["attendance", userId],
    queryFn: () => fetchAttendance(userId!),
    enabled: !!userId,
  });
}
