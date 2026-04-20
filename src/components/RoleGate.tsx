import { useRole, AppRole } from "@/hooks/useRole";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RoleGateProps {
  children: ReactNode;
  role: AppRole | AppRole[];
  fallback?: ReactNode;
  redirect?: boolean;
}

export const RoleGate = ({ children, role, fallback = null, redirect = false }: RoleGateProps) => {
  const { role: currentRole, isLoading } = useRole();
  
  if (isLoading) return null; // Or a smaller skeleton

  const allowedRoles = Array.isArray(role) ? role : [role];
  const hasAccess = allowedRoles.includes(currentRole as AppRole);

  if (!hasAccess) {
    if (redirect) {
      return <Navigate to="/403" replace />;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
