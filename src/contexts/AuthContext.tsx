import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type Portal = "student" | "teacher" | "admin";

export interface User {
  id?: string;
  name: string;
  email: string;
  portal: Portal;
  department?: string;
  semester?: number;
  rollNo?: string;
  avatar?: string;
  isDemo?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, portal: Portal) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, fullName: string, portal: Portal) => Promise<{ success: boolean; error?: string }>;
  demoLogin: (portal: Portal) => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: Record<Portal, User> = {
  student: {
    name: "Arjun Sharma",
    email: "arjun@nitdgp.ac.in",
    portal: "student",
    department: "Computer Science & Engineering",
    semester: 5,
    rollNo: "21CS8042",
    isDemo: true,
  },
  teacher: {
    name: "Prof. Rajesh Verma",
    email: "prof.verma@nitdgp.ac.in",
    portal: "teacher",
    department: "Computer Science & Engineering",
    isDemo: true,
  },
  admin: {
    name: "Dr. Anita Roy",
    email: "admin@nitdgp.ac.in",
    portal: "admin",
    isDemo: true,
  },
};

function mapSupabaseUser(su: SupabaseUser, profile?: any): User {
  return {
    id: su.id,
    name: profile?.full_name || su.user_metadata?.full_name || su.email?.split("@")[0] || "User",
    email: su.email || "",
    portal: (profile?.portal || su.user_metadata?.portal || "student") as Portal,
    department: profile?.department || "",
    semester: profile?.semester || 1,
    rollNo: profile?.roll_no || "",
    avatar: profile?.avatar_url || "",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setUser(mapSupabaseUser(session.user, profile));
      } else {
        // Check for demo session
        const saved = localStorage.getItem("nexus_demo_session");
        if (saved) {
          try { setUser(JSON.parse(saved)); } catch { localStorage.removeItem("nexus_demo_session"); }
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setUser(mapSupabaseUser(session.user, profile));
      } else {
        const saved = localStorage.getItem("nexus_demo_session");
        if (saved) {
          try { setUser(JSON.parse(saved)); } catch { localStorage.removeItem("nexus_demo_session"); }
        }
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, portal: Portal): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes("Invalid login")) return { success: false, error: "Invalid email or password. Please check your credentials." };
      if (error.message.includes("Email not confirmed")) return { success: false, error: "Please verify your email before signing in. Check your inbox." };
      return { success: false, error: error.message };
    }
    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      // Update portal if different
      if (profile && profile.portal !== portal) {
        await supabase.from("profiles").update({ portal }).eq("id", data.user.id);
      }
      setUser(mapSupabaseUser(data.user, { ...profile, portal }));
    }
    return { success: true };
  };

  const signup = async (email: string, password: string, fullName: string, portal: Portal): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, portal },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const demoLogin = (portal: Portal) => {
    const demoUser = DEMO_USERS[portal];
    setUser(demoUser);
    localStorage.setItem("nexus_demo_session", JSON.stringify(demoUser));
  };

  const logout = async () => {
    localStorage.removeItem("nexus_demo_session");
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, demoLogin, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
