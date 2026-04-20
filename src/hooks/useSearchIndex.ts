import { useMemo } from "react";
import Fuse from "fuse.js";
import { useProfessors } from "./useProfessors";
import { usePlacements } from "./usePlacements";

export function useSearchIndex() {
  const { data: professors = [] } = useProfessors();
  const { data: placements = [] } = usePlacements();

  const searchData = useMemo(() => {
    return [
      ...professors.map(p => ({ ...p, type: 'professor', title: p.name })),
      ...placements.map(p => ({ ...p, type: 'placement', title: p.company })), // company vs company_name?
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
