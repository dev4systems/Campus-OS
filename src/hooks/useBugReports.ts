import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBugReport } from "@/services/bug_reports.service";

export function useCreateBugReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBugReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bug_reports"] });
    },
  });
}
