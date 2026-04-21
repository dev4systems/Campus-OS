import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SessionGate } from "../SessionGate";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("SessionGate", () => {
  it("renders skeleton screen when sessionLoading is true", () => {
    (useAuth as any).mockReturnValue({ sessionLoading: true });
    render(
      <SessionGate>
        <div>Content</div>
      </SessionGate>
    );
    expect(screen.getByText("Establishing secure session...")).toBeDefined();
    expect(screen.queryByText("Content")).toBeNull();
  });

  it("renders children when sessionLoading is false", () => {
    (useAuth as any).mockReturnValue({ sessionLoading: false });
    render(
      <SessionGate>
        <div>Content</div>
      </SessionGate>
    );
    expect(screen.getByText("Content")).toBeDefined();
  });
});
