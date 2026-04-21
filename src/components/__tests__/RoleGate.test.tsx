import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RoleGate } from "../RoleGate";
import { useRole } from "@/hooks/useRole";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import React from "react";

vi.mock("@/hooks/useRole", () => ({
  useRole: vi.fn(),
}));

describe("RoleGate", () => {
  it("renders children when role matches", () => {
    (useRole as any).mockReturnValue({ role: "student", isLoading: false });
    render(
      <RoleGate role="student">
        <div>Access Granted</div>
      </RoleGate>
    );
    expect(screen.getByText("Access Granted")).toBeDefined();
  });

  it("renders null when role does not match and no fallback", () => {
    (useRole as any).mockReturnValue({ role: "faculty", isLoading: false });
    const { container } = render(
      <RoleGate role="student">
        <div>Access Granted</div>
      </RoleGate>
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders fallback when role does not match", () => {
    (useRole as any).mockReturnValue({ role: "faculty", isLoading: false });
    render(
      <RoleGate role="student" fallback={<div>Access Denied</div>}>
        <div>Access Granted</div>
      </RoleGate>
    );
    expect(screen.getByText("Access Denied")).toBeDefined();
  });

  it("redirects to /403 when redirect=true and no access", () => {
    (useRole as any).mockReturnValue({ role: "faculty", isLoading: false });
    render(
      <MemoryRouter initialEntries={["/test"]}>
        <Routes>
          <Route path="/test" element={
            <RoleGate role="student" redirect={true}>
              <div>Access Granted</div>
            </RoleGate>
          } />
          <Route path="/403" element={<div>403 Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("403 Page")).toBeDefined();
  });

  it("renders null when isLoading is true", () => {
    (useRole as any).mockReturnValue({ role: null, isLoading: true });
    const { container } = render(
      <RoleGate role="student">
        <div>Access Granted</div>
      </RoleGate>
    );
    expect(container.firstChild).toBeNull();
  });
});
