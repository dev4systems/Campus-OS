import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPlacementDrives, togglePlacementNotification, fetchStudentPlacementNotifications } from "@/services/placements.service";

export function usePlacementDrives() {
  return useQuery({
    queryKey: ["placement-drives"],
    queryFn: fetchPlacementDrives,
    staleTime: 5 * 60 * 1000,
  });
}

export function useStudentPlacementNotifications(studentId?: string) {
  return useQuery({
    queryKey: ["placement-notifications", studentId],
    queryFn: () => fetchStudentPlacementNotifications(studentId!),
    enabled: !!studentId,
  });
}

export function useTogglePlacementNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, driveId }: { studentId: string, driveId: string }) => 
      togglePlacementNotification(studentId, driveId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["placement-notifications", variables.studentId] });
    },
  });
}
