import { useMemo } from "react";
import Fuse from "fuse.js";
import { useProfessors } from "./useProfessors";
import { usePlacementDrives } from "./usePlacements";
import { Professor, PlacementDrive } from "@/types";

export function useSearchIndex() {
  const { data: professors = [] } = useProfessors();
  const { data: placements = [] } = usePlacementDrives();

  const searchData = useMemo(() => {
    return [
      ...professors.map((p: Professor) => ({ ...p, type: 'professor', title: p.name })),
      ...placements.map((p: PlacementDrive) => ({ ...p, type: 'placement', title: p.company_name })),
    ];
  }, [professors, placements]);

  const fuse = useMemo(() => {
    return new Fuse(searchData, {
      keys: ["title", "name", "subjects", "research", "department", "company", "role"],
      threshold: 0.35,
    });
  }, [searchData]);

  return fuse;
}
