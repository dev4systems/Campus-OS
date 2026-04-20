import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = 'student' | 'faculty' | 'admin' | 'placement_officer';

export function useRole() {
  const { user } = useAuth();
  
  const { data: roleData, isLoading } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error("Error fetching user role:", error);
        return 'student'; // Fallback
      }
      
      return (data as any).role as AppRole;
    },
    enabled: !!user?.id,
    staleTime: Infinity, // Role doesn't change often
    gcTime: 30 * 60 * 1000,
  });

  // For demo users, use the role from the user object if available, otherwise derive from portal
  const effectiveRole = user?.isDemo 
    ? (user.portal === 'teacher' ? 'faculty' : (user.portal as AppRole))
    : (roleData || 'student');

  return {
    role: effectiveRole,
    isStudent: effectiveRole === 'student',
    isFaculty: effectiveRole === 'faculty',
    isAdmin: effectiveRole === 'admin',
    isPlacementOfficer: effectiveRole === 'placement_officer',
    isLoading: !user?.isDemo && isLoading,
  };
}
