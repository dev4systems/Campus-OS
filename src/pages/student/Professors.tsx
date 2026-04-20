import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { GraduationCap, Mail, CalendarDays, FlaskConical, ExternalLink, Search, Phone, Copy, SlidersHorizontal, UserCheck, MessageSquare, Plus, Clock } from "lucide-react";
import { useProfessors } from "@/hooks/useProfessors";
import { useResearchProjects, useCreateCollaborationRequest } from "@/hooks/useResearch";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Professor, ResearchProject } from "@/types";

const DEPARTMENTS = ["All", "CSE", "ECE", "EE", "ME", "Civil", "Mathematics", "Physics"];

const designationBadge = (d: string) => {
  if (d === "Professor" || d === "HOD") return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
  if (d === "Assoc. Prof.") return "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300";
  return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300";
};

const YEAR_KEYWORDS: Record<string, string[]> = {
  "1st Year": ["Programming", "Mathematics", "Physics", "Chemistry", "Engineering Drawing"],
  "2nd Year": ["Data Structures", "Digital Electronics", "Discrete", "Computer Organisation"],
  "3rd Year": ["Algorithms", "Operating Systems", "Computer Networks", "DBMS", "Software Engineering"],
  "4th Year": ["Machine Learning", "Deep Learning", "Cryptography", "NLP", "Computer Vision", "Distributed"],
};

const MY_SUBJECTS = [
  "Data Structures & Algorithms", "Operating Systems", "Computer Networks",
  "Database Management Systems", "Software Engineering",
];

const matchesYear = (prof: Professor, year: string): boolean => {
  const keywords = YEAR_KEYWORDS[year];
  if (!keywords) return true;
  return prof.subjects.some(s => keywords.some(k => s.toLowerCase().includes(k.toLowerCase())));
};

const matchesMySubjects = (prof: Professor): boolean => {
  return prof.subjects.some(s => MY_SUBJECTS.some(ms => s.toLowerCase().includes(ms.toLowerCase()) || ms.toLowerCase().includes(s.toLowerCase())));
};

const Professors = () => {
  const { user } = useAuth();
  const { data: professors = [], isLoading: professorsLoading } = useProfessors();
  const { data: projects = [], isLoading: researchLoading } = useResearchProjects();
  const { mutate: requestCollab, isPending: isSubmittingCollab } = useCreateCollaborationRequest();

  const [search, setSearch] = useState("");
  const [desFilter, setDesFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [expFilter, setExpFilter] = useState("Any");
  const [labOnly, setLabOnly] = useState(false);
  const [teachingMe, setTeachingMe] = useState(false);
  const [sortBy, setSortBy] = useState("senior");
  const [selected, setSelected] = useState<Professor | null>(null);
  
  // Collab Dialog State
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
  const [collabMessage, setCollabMessage] = useState("");

  const fuse = useMemo(() => new Fuse(professors, {
    keys: ["name", "subjects", "research", "department"],
    threshold: 0.35,
  }), [professors]);

  const filtered = useMemo(() => {
    let list = search.trim() ? fuse.search(search).map(r => r.item) : [...professors];

    if (desFilter !== "All") {
      list = list.filter(p => p.designation_short === desFilter);
    }
    if (deptFilter !== "All") {
      list = list.filter(p => (p.department || "CSE") === deptFilter);
    }
    if (yearFilter !== "All Years") {
      list = list.filter(p => matchesYear(p, yearFilter));
    }
    if (expFilter !== "Any") {
      list = list.filter(p => {
        const exp = 2026 - p.joined;
        if (expFilter === "<5") return exp < 5;
        if (expFilter === "5-10") return exp >= 5 && exp <= 10;
        if (expFilter === "10-20") return exp > 10 && exp <= 20;
        if (expFilter === "20+") return exp > 20;
        return true;
      });
    }
    if (labOnly) list = list.filter(p => p.lab);
    if (teachingMe) list = list.filter(matchesMySubjects);

    list.sort((a, b) => {
      if (sortBy === "senior") return a.joined - b.joined;
      if (sortBy === "junior") return b.joined - a.joined;
      if (sortBy === "az") return a.name.localeCompare(b.name);
      if (sortBy === "designation") {
        const order: Record<string, number> = { "HOD": 0, "Professor": 1, "Assoc. Prof.": 2, "Asst. Prof.": 3 };
        return (order[a.designation_short] ?? 9) - (order[b.designation_short] ?? 9);
      }
      return 0;
    });

    return list;
  }, [search, desFilter, deptFilter, yearFilter, expFilter, labOnly, teachingMe, sortBy, professors, fuse]);

  const currentYear = new Date().getFullYear();

  const activeFilterCount = [
    desFilter !== "All",
    deptFilter !== "All",
    yearFilter !== "All Years",
    expFilter !== "Any",
    labOnly,
    teachingMe,
  ].filter(Boolean).length;

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success("Email copied!");
  };

  const handleCollabSubmit = () => {
    if (!selectedProject || !user?.id) return;
    if (!collabMessage.trim()) {
      toast.error("Please enter a message for the professor");
      return;
    }

    requestCollab({
      student_id: user.id,
      project_id: selectedProject.id,
      message: collabMessage,
      status: 'pending'
    }, {
      onSuccess: () => {
        toast.success("Collaboration request sent successfully!");
        setSelectedProject(null);
        setCollabMessage("");
      },
      onError: (err: any) => toast.error(`Failed: ${err.message}`)
    });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="scroll-reveal">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <GraduationCap className="h-6 w-6" style={{ color: "hsl(var(--primary))" }} />
          Faculty Hub — NIT Durgapur
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Research, Directory & Collaboration</p>
      </div>

      <Tabs defaultValue="directory" className="w-full">
        <div className="flex items-center justify-between mb-4 border-b border-border pb-1">
          <TabsList className="bg-transparent gap-6 h-auto p-0">
            <TabsTrigger value="directory" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-3 text-sm font-semibold transition-all">Faculty Directory</TabsTrigger>
            <TabsTrigger value="research" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-3 text-sm font-semibold transition-all">Research Projects</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="directory" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Filter bar */}
          <div className="space-y-3">
            {/* Row 1: Search + Department pills */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search name, subject, research…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
              </div>
              {DEPARTMENTS.map(d => (
                <button key={d} onClick={() => setDeptFilter(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${deptFilter === d ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}
                >{d}</button>
              ))}
            </div>

            {/* Row 2: Designation pills + filters + sort */}
            <div className="flex flex-wrap items-center gap-3">
              {["All", "HOD", "Professor", "Assoc. Prof.", "Asst. Prof."].map(d => (
                <button key={d} onClick={() => setDesFilter(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${desFilter === d ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}
                >{d === "All" ? "All Designations" : d}</button>
              ))}

              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="h-8 w-[130px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["All Years", "1st Year", "2nd Year", "3rd Year", "4th Year"].map(y => (
                    <SelectItem key={y} value={y} className="text-xs">{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={expFilter} onValueChange={setExpFilter}>
                <SelectTrigger className="h-8 w-[120px] text-xs">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any" className="text-xs">Any Exp.</SelectItem>
                  <SelectItem value="<5" className="text-xs">&lt;5 years</SelectItem>
                  <SelectItem value="5-10" className="text-xs">5–10 years</SelectItem>
                  <SelectItem value="10-20" className="text-xs">10–20 years</SelectItem>
                  <SelectItem value="20+" className="text-xs">20+ years</SelectItem>
                </SelectContent>
              </Select>

              <button onClick={() => setLabOnly(!labOnly)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1 ${labOnly ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}
              ><FlaskConical className="h-3.5 w-3.5" /> Has Lab</button>

              <button onClick={() => setTeachingMe(!teachingMe)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1 ${teachingMe ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}
              ><UserCheck className="h-3.5 w-3.5" /> Teaching Me</button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-8 w-[140px] text-xs ml-auto">
                  <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="senior" className="text-xs">Most Senior</SelectItem>
                  <SelectItem value="junior" className="text-xs">Most Junior</SelectItem>
                  <SelectItem value="az" className="text-xs">A–Z Name</SelectItem>
                  <SelectItem value="designation" className="text-xs">By Designation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active filter count + result count */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-medium">{filtered.length} professor{filtered.length !== 1 ? "s" : ""} found</span>
              {activeFilterCount > 0 && (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                  {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                </Badge>
              )}
            </div>
          </div>

          {/* Cards grid */}
          {professorsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-56 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
              {deptFilter !== "All"
                ? `No faculty from ${deptFilter} department added yet.`
                : "No professors match your filters."}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <div key={p.id} className="scroll-reveal revealed rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ backgroundColor: p.color }}>{p.initials}</div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm truncate">{p.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Badge className={`text-[10px] ${designationBadge(p.designation_short)}`}>{p.designation_short}</Badge>
                        {p.department && <Badge variant="outline" className="text-[10px]">{p.department}</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3 space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors" onClick={() => copyEmail(p.email)}>
                      <Mail className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{p.email}</span>
                    </div>
                    <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 shrink-0" />Joined {p.joined}</div>
                  </div>
                  <div className="border-t border-border pt-3 flex flex-wrap gap-1.5">
                    {p.research.slice(0, 2).map(r => (
                      <span key={r} className="px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground">{r}</span>
                    ))}
                    {p.research.length > 2 && <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground">+{p.research.length - 2} more</span>}
                  </div>
                  {p.lab && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <FlaskConical className="h-3.5 w-3.5" style={{ color: "#f59e0b" }} />
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] font-medium">{p.lab}</span>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="mt-auto text-xs w-full" onClick={() => setSelected(p)}>
                    View Profile <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="research" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Active Research Projects</h2>
              <p className="text-xs text-muted-foreground">Opportunities for student collaboration and internships</p>
            </div>
          </div>

          {researchLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-3 opacity-20" />
              <p>No active research projects found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-sm transition-all flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-bold text-foreground leading-snug">{proj.title}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="font-medium text-primary">{proj.professors?.name}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(proj.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant={proj.status === 'seeking_students' ? 'default' : 'secondary'} className="text-[10px]">
                      {proj.status === 'seeking_students' ? 'Hiring' : proj.status}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-3">{proj.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {proj.domain_tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-[9px] bg-muted/30">{tag}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4 mt-1">
                    <div className="text-[10px] text-muted-foreground">
                      <span className="font-semibold text-foreground">{proj.max_students}</span> spots available
                    </div>
                    <Button size="sm" className="h-8 text-xs px-4" 
                      onClick={() => setSelectedProject(proj)}
                      disabled={proj.status !== 'seeking_students'}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Request Collab
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Collaboration Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={o => !o && setSelectedProject(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Collaboration</DialogTitle>
            <DialogDescription>
              Send a message to {selectedProject?.professors?.name} regarding "{selectedProject?.title}".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Message</label>
              <Textarea 
                placeholder="Briefly describe your interest, background, and why you'd like to work on this project..." 
                className="min-h-[150px] text-sm"
                value={collabMessage}
                onChange={e => setCollabMessage(e.target.value)}
              />
            </div>
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
              <p className="text-[11px] text-primary leading-tight">
                <strong>Tip:</strong> Mention your relevant skills, CGPA, or previous projects to increase your chances of selection.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSelectedProject(null)}>Cancel</Button>
            <Button size="sm" onClick={handleCollabSubmit} disabled={isSubmittingCollab}>
              {isSubmittingCollab ? "Sending..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Slide-over panel */}
      <Sheet open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <div className="space-y-6 pt-2">
              <SheetHeader className="flex-row items-center gap-4 space-y-0">
                <div className="h-20 w-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shrink-0" style={{ backgroundColor: selected.color }}>{selected.initials}</div>
                <div>
                  <SheetTitle className="text-lg">{selected.name}</SheetTitle>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge className={`${designationBadge(selected.designation_short)}`}>{selected.designation}</Badge>
                    {selected.department && <Badge variant="outline">{selected.department}</Badge>}
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Joined NIT Durgapur: {selected.joined} ({currentYear - selected.joined} years)</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{selected.email}</span>
                  <button onClick={() => copyEmail(selected.email)} className="text-muted-foreground hover:text-foreground"><Copy className="h-3.5 w-3.5" /></button>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selected.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Subjects Taught</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.subjects.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Research Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.research.map(r => <Badge key={r} variant="outline" className="text-xs">{r}</Badge>)}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Lab</h4>
                {selected.lab ? (
                  <div className="flex items-center gap-2 text-sm">
                    <FlaskConical className="h-4 w-4" style={{ color: "#f59e0b" }} /><span>{selected.lab}</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No dedicated lab</p>
                )}
              </div>

              <a href={selected.profile_url} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" className="w-full text-sm">View on NIT Durgapur Website <ExternalLink className="h-4 w-4 ml-1" /></Button>
              </a>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Professors;
