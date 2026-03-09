import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Portal = "student" | "teacher" | "admin";

export interface User {
  name: string;
  email: string;
  portal: Portal;
  department?: string;
  semester?: number;
  rollNo?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, portal: Portal) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: Record<Portal, User & { password: string }> = {
  student: {
    name: "Arjun Sharma",
    email: "arjun@nitdgp.ac.in",
    password: "password123",
    portal: "student",
    department: "Computer Science & Engineering",
    semester: 5,
    rollNo: "21CS8042",
  },
  teacher: {
    name: "Prof. Rajesh Verma",
    email: "prof.verma@nitdgp.ac.in",
    password: "password123",
    portal: "teacher",
    department: "Computer Science & Engineering",
  },
  admin: {
    name: "Dr. Anita Roy",
    email: "admin@nitdgp.ac.in",
    password: "password123",
    portal: "admin",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("nexus_session");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("nexus_session");
      }
    }
  }, []);

  const login = async (email: string, password: string, portal: Portal): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 600));
    const demo = DEMO_USERS[portal];
    if (email === demo.email && password === demo.password) {
      const { password: _, ...userData } = demo;
      setUser(userData);
      localStorage.setItem("nexus_session", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nexus_session");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
