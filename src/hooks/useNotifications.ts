import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/services/notifications.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => {
      if (!user?.id || user?.isDemo) return Promise.resolve([]);
      return fetchNotifications(user.id);
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // refresh every 30 seconds
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
    },
    onError: () => {
      toast.error("Failed to mark notification as read");
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => {
      if (!user?.id) return Promise.resolve();
      return markAllNotificationsAsRead(user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
      toast.success("All notifications marked as read");
    },
    onError: () => {
      toast.error("Failed to mark notifications as read");
    }
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
}
