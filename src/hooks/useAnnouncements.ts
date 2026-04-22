import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAnnouncements, createAnnouncement, deleteAnnouncement } from "@/services/announcements.service";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useAnnouncements() {
  const { role } = useRole();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements", role],
    queryFn: () => {
      if (!role) return Promise.resolve([]);
      return fetchAnnouncements(role);
    },
    enabled: !!role,
  });

  const createMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement posted successfully");
    },
    onError: () => {
      toast.error("Failed to post announcement");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement deleted");
    },
    onError: () => {
      toast.error("Failed to delete announcement");
    }
  });

  return {
    announcements,
    isLoading,
    createAnnouncement: createMutation.mutateAsync,
    deleteAnnouncement: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
