import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSearchIndex } from "../useSearchIndex";
import { useProfessors } from "../useProfessors";
import { usePlacementDrives } from "../usePlacements";
import Fuse from "fuse.js";

vi.mock("../useProfessors", () => ({
  useProfessors: vi.fn(),
}));

vi.mock("../usePlacements", () => ({
  usePlacementDrives: vi.fn(),
}));

describe("useSearchIndex", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a Fuse instance even with empty data", () => {
    (useProfessors as any).mockReturnValue({ data: [] });
    (usePlacementDrives as any).mockReturnValue({ data: [] });

    const { result } = renderHook(() => useSearchIndex());

    expect(result.current).toBeInstanceOf(Fuse);
  });

  it("returns relevant results from professors array", () => {
    const mockProfs = [{ id: "p1", name: "Dr. Smith", department: "CS" }];
    (useProfessors as any).mockReturnValue({ data: mockProfs });
    (usePlacementDrives as any).mockReturnValue({ data: [] });

    const { result } = renderHook(() => useSearchIndex());
    const searchResult = result.current.search("Smith");

    expect(searchResult.length).toBeGreaterThan(0);
    expect(searchResult[0].item.title).toBe("Dr. Smith");
  });

  it("returns relevant results from placements array", () => {
    const mockPlacements = [{ id: "d1", company_name: "Google", role: "SDE" }];
    (useProfessors as any).mockReturnValue({ data: [] });
    (usePlacementDrives as any).mockReturnValue({ data: mockPlacements });

    const { result } = renderHook(() => useSearchIndex());
    const searchResult = result.current.search("Google");

    expect(searchResult.length).toBeGreaterThan(0);
    expect(searchResult[0].item.title).toBe("Google");
  });
});
