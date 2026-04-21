import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchDAU, fetchFeatureUsage, fetchAttendanceHealth, fetchPlacementFunnel, trackPageView } from "@/services/analytics.service";

export function useAnalytics() {
  const dau = useQuery({ queryKey: ["analytics", "dau"], queryFn: fetchDAU });
  const featureUsage = useQuery({ queryKey: ["analytics", "feature-usage"], queryFn: fetchFeatureUsage });
  const attendanceHealth = useQuery({ queryKey: ["analytics", "attendance-health"], queryFn: fetchAttendanceHealth });
  const placementFunnel = useQuery({ queryKey: ["analytics", "placement-funnel"], queryFn: fetchPlacementFunnel });

  return { dau, featureUsage, attendanceHealth, placementFunnel };
}

export function usePageView(feature?: string) {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      trackPageView(user.id, location.pathname, feature);
    }
  }, [location.pathname, user?.id, feature]);
}
