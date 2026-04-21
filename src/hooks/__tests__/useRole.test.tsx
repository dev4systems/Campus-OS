import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRole } from "../useRole";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}));

describe("useRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns student role when Supabase returns student", () => {
    (useAuth as any).mockReturnValue({ user: { id: "u1", isDemo: false } });
    (useQuery as any).mockReturnValue({ data: "student", isLoading: false });

    const { result } = renderHook(() => useRole());

    expect(result.current.role).toBe("student");
    expect(result.current.isStudent).toBe(true);
    expect(result.current.isAdmin).toBe(false);
  });

  it("returns admin role when Supabase returns admin", () => {
    (useAuth as any).mockReturnValue({ user: { id: "u2", isDemo: false } });
    (useQuery as any).mockReturnValue({ data: "admin", isLoading: false });

    const { result } = renderHook(() => useRole());

    expect(result.current.role).toBe("admin");
    expect(result.current.isAdmin).toBe(true);
  });

  it("returns faculty role when Supabase returns faculty", () => {
    (useAuth as any).mockReturnValue({ user: { id: "u3", isDemo: false } });
    (useQuery as any).mockReturnValue({ data: "faculty", isLoading: false });

    const { result } = renderHook(() => useRole());

    expect(result.current.role).toBe("faculty");
    expect(result.current.isFaculty).toBe(true);
  });

  it("falls back to student when roleData is null", () => {
    (useAuth as any).mockReturnValue({ user: { id: "u4", isDemo: false } });
    (useQuery as any).mockReturnValue({ data: null, isLoading: false });

    const { result } = renderHook(() => useRole());

    expect(result.current.role).toBe("student");
  });

  it("handles demo user with teacher portal as faculty", () => {
    (useAuth as any).mockReturnValue({
      user: { id: "demo", isDemo: true, portal: "teacher" },
    });
    (useQuery as any).mockReturnValue({ data: null, isLoading: false });

    const { result } = renderHook(() => useRole());

    expect(result.current.role).toBe("faculty");
    expect(result.current.isFaculty).toBe(true);
  });
});
