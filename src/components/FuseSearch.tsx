import { useState, useRef, useCallback, useEffect } from "react";
import { Search, Clock, X, Loader2 } from "lucide-react";
import Fuse, { type IFuseOptions, type FuseResult } from "fuse.js";

interface FuseSearchProps<T> {
  data: T[];
  keys: string[];
  onSelect?: (item: T) => void;
  placeholder?: string;
  displayKey?: string;
}

const RECENT_KEY = "cc_recent_searches";
const MAX_RECENT = 8;
const MAX_CACHE = 50;

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}
function saveRecent(searches: string[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(searches.slice(0, MAX_RECENT)));
}

function highlightMatch(text: string, indices: readonly [number, number][]): React.ReactNode[] {
  if (!indices?.length) return [text];
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  for (const [start, end] of indices) {
    if (start > lastIndex) result.push(text.slice(lastIndex, start));
    result.push(<mark key={start} className="bg-accent/30 text-foreground rounded-sm px-0.5">{text.slice(start, end + 1)}</mark>);
    lastIndex = end + 1;
  }
  if (lastIndex < text.length) result.push(text.slice(lastIndex));
  return result;
}

function FuseSearch<T extends Record<string, any>>({ data, keys, onSelect, placeholder = "Search...", displayKey }: FuseSearchProps<T>) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FuseResult<T>[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecent);

  const cacheRef = useRef(new Map<string, FuseResult<T>[]>());
  const cacheQueue = useRef<string[]>([]);
  const timerRef = useRef<number>();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const fuseRef = useRef<Fuse<T>>();
  useEffect(() => {
    const opts: IFuseOptions<T> = { keys, threshold: 0.35, includeMatches: true, minMatchCharLength: 2 };
    fuseRef.current = new Fuse(data, opts);
  }, [data, keys]);

  const search = useCallback((q: string) => {
    const key = q.toLowerCase().trim();
    if (!key) { setResults([]); setSearching(false); return; }

    if (cacheRef.current.has(key)) {
      setResults(cacheRef.current.get(key)!);
      setSearching(false);
      return;
    }

    const r = fuseRef.current?.search(q, { limit: 6 }) || [];
    cacheRef.current.set(key, r);
    cacheQueue.current.push(key);
    if (cacheQueue.current.length > MAX_CACHE) {
      const oldest = cacheQueue.current.shift()!;
      cacheRef.current.delete(oldest);
    }
    setResults(r);
    setSearching(false);
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    setActiveIdx(-1);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!val.trim()) { setResults([]); setSearching(false); return; }
    setSearching(true);
    timerRef.current = window.setTimeout(() => search(val), 300);
  };

  const selectItem = (item: T, text: string) => {
    const recent = [text, ...recentSearches.filter(r => r !== text)].slice(0, MAX_RECENT);
    setRecentSearches(recent);
    saveRecent(recent);
    setOpen(false);
    setQuery(text);
    onSelect?.(item);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = query.trim() ? results : [];
    const recentItems = !query.trim() ? recentSearches : [];
    const total = items.length || recentItems.length;

    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, total - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      if (items.length && items[activeIdx]) {
        const dk = displayKey || keys[0];
        selectItem(items[activeIdx].item, String(items[activeIdx].item[dk] || ""));
      }
    }
    else if (e.key === "Escape") { setOpen(false); }
  };

  const showDropdown = open && (query.trim() ? true : recentSearches.length > 0);
  const dk = displayKey || keys[0];

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
          className="w-full h-12 md:h-[48px] pl-11 pr-4 rounded-full border border-border bg-card text-foreground text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
        />
      </div>

      {showDropdown && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-lg max-h-80 overflow-auto origin-top animate-in fade-in zoom-in-95"
          role="listbox"
        >
          {!query.trim() && recentSearches.length > 0 && (
            <>
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground">Recent Searches</span>
                <button onClick={() => { setRecentSearches([]); saveRecent([]); }} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
              </div>
              {recentSearches.map((r, i) => (
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
            const match = r.matches?.find(m => m.key === dk);
            const text = String(r.item[dk] || "");
            return (
              <button
                key={i}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${activeIdx === i ? "bg-accent/10" : "hover:bg-muted/50"}`}
                role="option"
                aria-selected={activeIdx === i}
                onMouseDown={() => selectItem(r.item, text)}
              >
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">
                  {match ? highlightMatch(text, match.indices as [number, number][]) : text}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FuseSearch;
