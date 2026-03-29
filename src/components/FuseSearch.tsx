interface AppItem {
  title: string;
  path: string;
  type: string;
}

const APP_DATA: AppItem[] = [
  { title: "Dashboard", path: "/student/dashboard", type: "page" },
  { title: "Timetable", path: "/student/timetable", type: "page" },
  { title: "Assignments", path: "/student/assignments", type: "page" },
  { title: "Campus Map", path: "/student/campus-nav", type: "page" },
  { title: "Library", path: "/student/library", type: "page" },
  { title: "Attendance", path: "/student/attendance", type: "page" },
  { title: "Courses", path: "/student/courses", type: "page" },
  { title: "Grades", path: "/student/grades", type: "page" },
  { title: "Fees", path: "/student/fees", type: "page" },
  { title: "Exams", path: "/student/exams", type: "page" },
  { title: "Campus Buzz", path: "/student/campus-buzz", type: "page" },
  { title: "Feedback", path: "/student/feedback", type: "page" },
];

import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, FileText, Loader2 } from "lucide-react";
import Fuse, { type FuseResult } from "fuse.js";

const fuse = new Fuse(APP_DATA, {
  keys: ["title"],
  threshold: 0.4,
  includeMatches: true,
  minMatchCharLength: 2,
});

const RECENT_KEY = "cc_recent_searches";
const MAX_RECENT = 6;

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}
function saveRecent(items: string[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(items.slice(0, MAX_RECENT)));
}

function highlightMatch(text: string, indices: readonly [number, number][]): React.ReactNode[] {
  if (!indices?.length) return [text];
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const [start, end] of indices) {
    if (start > last) parts.push(text.slice(last, start));
    parts.push(<mark key={start} className="bg-accent/30 text-foreground rounded-sm px-0.5">{text.slice(start, end + 1)}</mark>);
    last = end + 1;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

interface FuseSearchProps {
  placeholder?: string;
}

const FuseSearch = ({ placeholder = "Search pages..." }: FuseSearchProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FuseResult<AppItem>[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [searching, setSearching] = useState(false);
  const [recent, setRecent] = useState<string[]>(getRecent);
  const timerRef = useRef<number>();
  const inputRef = useRef<HTMLInputElement>(null);

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) { setResults([]); setSearching(false); return; }
    setResults(fuse.search(q).slice(0, 6));
    setSearching(false);
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    setActiveIdx(-1);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!val.trim()) { setResults([]); setSearching(false); return; }
    setSearching(true);
    timerRef.current = window.setTimeout(() => doSearch(val), 300);
  };

  const selectItem = (item: AppItem, text: string) => {
    const updated = [text, ...recent.filter(r => r !== text)].slice(0, MAX_RECENT);
    setRecent(updated);
    saveRecent(updated);
    setOpen(false);
    setQuery("");
    navigate(item.path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = query.trim() ? results : [];
    const recentItems = !query.trim() ? recent : [];
    const total = items.length || recentItems.length;

    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, total - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      if (items.length && items[activeIdx]) {
        selectItem(items[activeIdx].item, items[activeIdx].item.title);
      } else if (recentItems.length && recentItems[activeIdx]) {
        setQuery(recentItems[activeIdx]);
        handleChange(recentItems[activeIdx]);
      }
    }
    else if (e.key === "Escape") { setOpen(false); }
  };

  const showDropdown = open && (query.trim() ? true : recent.length > 0);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </div>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-12 pl-11 pr-4 rounded-full border border-border bg-card text-foreground text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
        />
      </div>

      {showDropdown && (
        <div
          className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-lg max-h-80 overflow-auto origin-top animate-in fade-in zoom-in-95"
          role="listbox"
        >
          {!query.trim() && recent.length > 0 && (
            <>
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground">Recent Searches</span>
                <button onClick={() => { setRecent([]); saveRecent([]); }} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
              </div>
              {recent.map((r, i) => (
                <button
                  key={r}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${activeIdx === i ? "bg-accent/10" : "hover:bg-muted/50"}`}
                  role="option"
                  aria-selected={activeIdx === i}
                  onMouseDown={() => { setQuery(r); handleChange(r); }}
                >
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{r}</span>
                </button>
              ))}
            </>
          )}

          {query.trim() && results.length === 0 && !searching && (
            <div className="flex flex-col items-center py-8 text-center">
              <Search className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No results for "{query}"</p>
            </div>
          )}

          {query.trim() && results.map((r, i) => {
            const match = r.matches?.find(m => m.key === "title");
            const text = r.item.title;
            return (
              <button
                key={i}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${activeIdx === i ? "bg-accent/10" : "hover:bg-muted/50"}`}
                role="option"
                aria-selected={activeIdx === i}
                onMouseDown={() => selectItem(r.item, text)}
              >
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <span className="text-foreground flex-1">
                  {match ? highlightMatch(text, match.indices as [number, number][]) : text}
                </span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{r.item.type}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FuseSearch;
