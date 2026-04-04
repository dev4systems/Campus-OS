import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { GraduationCap, Mail, CalendarDays, FlaskConical, ExternalLink, Search, Phone, BookOpen, Copy, X, SlidersHorizontal, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Professor {
  id: string; name: string; designation: string; designation_short: string;
  email: string; phone: string; joined: number; initials: string; color: string;
  research: string[]; subjects: string[]; lab: string | null; profile_url: string;
}

const FALLBACK_PROFESSORS: Professor[] = [
  {"id":"p001","name":"Prof. Tanmay De","designation":"Professor & HOD","designation_short":"HOD","email":"hod.cse@nitdgp.ac.in","phone":"+91-9434788123","joined":1998,"initials":"TD","color":"#1a3a5c","research":["Optical Networks","Delay Tolerant Networks","Wireless Sensor Networks"],"subjects":["Computer Networks","Advanced Networking"],"lab":null,"profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/hod-2"},
  {"id":"p002","name":"Dr. Asok Sarkar","designation":"Associate Professor","designation_short":"Assoc. Prof.","email":"asarkar.cse@nitdgp.ac.in","phone":"+91-9434002205","joined":2000,"initials":"AS","color":"#2d6a4f","research":["Design & Analysis of Algorithms","Computational Theory","Graph Theory"],"subjects":["Design & Analysis of Algorithms","Theory of Computation"],"lab":null,"profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p003","name":"Dr. Atanu Dutta","designation":"Associate Professor","designation_short":"Assoc. Prof.","email":"adutta.cse@nitdgp.ac.in","phone":"+91-9434788180","joined":2007,"initials":"AD","color":"#6a0572","research":["Agentic AI","LLM Multi-agent Systems","Natural Language Processing"],"subjects":["Artificial Intelligence","Machine Learning"],"lab":"AI/ML Research Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p004","name":"Dr. Prasenjit Choudhury","designation":"Associate Professor","designation_short":"Assoc. Prof.","email":"pchoudhury.cse@nitdgp.ac.in","phone":"+91-9434788196","joined":2001,"initials":"PC","color":"#b5451b","research":["Algorithmic Game Theory","Resource Allocation","Mechanism Design"],"subjects":["Discrete Mathematics","Algorithms"],"lab":null,"profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1/prasenjit-choudhury"},
  {"id":"p005","name":"Dr. Sujan Kumar Saha","designation":"Associate Professor","designation_short":"Assoc. Prof.","email":"ssaha.cse@nitdgp.ac.in","phone":"","joined":2022,"initials":"SS","color":"#0d4f8b","research":["Natural Language Processing","Education Technology","Handwritten Character Recognition","Speech Recognition in Indian Languages"],"subjects":["Natural Language Processing","Information Retrieval"],"lab":"NLP Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1/sujan-kumar-saha"},
  {"id":"p006","name":"Dr. Biswapati Jana","designation":"Associate Professor","designation_short":"Assoc. Prof.","email":"bchakraborty.cse@nitdgp.ac.in","phone":"+91-9434788065","joined":2001,"initials":"BJ","color":"#1b4332","research":["Hardware Security","Cognitive Computing","VLSI Design & Testing"],"subjects":["Computer Organisation & Architecture","VLSI Design"],"lab":"Hardware Security Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p007","name":"Dr. Binanda Sengupta","designation":"Associate Professor","designation_short":"Assoc. Prof.","email":"bsen.cse@nitdgp.ac.in","phone":"+91-9434788161","joined":2008,"initials":"BS","color":"#3a0ca3","research":["Biometrics","Pattern Recognition","Image Processing"],"subjects":["Pattern Recognition","Digital Image Processing"],"lab":"Biometrics Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p008","name":"Dr. Dibyendu Nandi","designation":"Associate Professor","designation_short":"Assoc. Prof.","email":"dnandi.cse@nitdgp.ac.in","phone":"+91-9434788026","joined":2001,"initials":"DN","color":"#457b9d","research":["Cellular Automata","VLSI Design & Testing","Cryptography"],"subjects":["Digital Electronics","Computer Architecture"],"lab":"VLSI Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p009","name":"Dr. Deepsubhra Guha Roy","designation":"Associate Professor","designation_short":"Assoc. Prof.","email":"dmitra.cse@nitdgp.ac.in","phone":"+91-9434789012","joined":2010,"initials":"DG","color":"#e63946","research":["Distributed Algorithms","Swarm Robotics","Robot Deployment","IoT"],"subjects":["Distributed Systems","Operating Systems"],"lab":"Robotics & IoT Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p010","name":"Dr. Amitava Das","designation":"Associate Professor","designation_short":"Assoc. Prof.","email":"ddas.cse@nitdgp.ac.in","phone":"+91-9434788179","joined":2007,"initials":"AD","color":"#f4a261","research":["Artificial Intelligence","Machine Learning","Sentiment Analysis"],"subjects":["Artificial Intelligence","Soft Computing"],"lab":"AI Research Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p011","name":"Dr. Goutam Saha (Sarker)","designation":"Professor","designation_short":"Professor","email":"gsarker.cse@nitdgp.ac.in","phone":"+91-9434788025","joined":1998,"initials":"GS","color":"#2b2d42","research":["Cryptography","Multiparty Computation","Information Security"],"subjects":["Cryptography & Network Security","Information Security"],"lab":"Cryptography Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p012","name":"Dr. Jaya Sil (Howlader)","designation":"Professor","designation_short":"Professor","email":"jhowlader.cse@nitdgp.ac.in","phone":"+91-9434788178","joined":2002,"initials":"JH","color":"#80b918","research":["Biomedical & Healthcare Systems","Multimedia","Machine Learning"],"subjects":["Multimedia Systems","Database Management Systems"],"lab":"Biomedical Computing Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p013","name":"Dr. Monidipa Das","designation":"Associate Professor","designation_short":"Assoc. Prof.","email":"mdalui.cse@nitdgp.ac.in","phone":"+91-9434789011","joined":2010,"initials":"MD","color":"#9c6644","research":["Computational Biology","Bioinformatics","Machine Learning"],"subjects":["Bioinformatics","Data Mining"],"lab":"Computational Biology Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p014","name":"Dr. Mrinal Kanti Saha","designation":"Professor","designation_short":"Professor","email":"msaha.cse@nitdgp.ac.in","phone":"+91-9434788194","joined":2000,"initials":"MS","color":"#264653","research":["Machine Learning","Deep Learning","Generative AI","Computer Vision"],"subjects":["Machine Learning","Deep Learning","Computer Vision"],"lab":"Deep Learning Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p015","name":"Dr. Narayan Chandra Jana","designation":"Associate Professor","designation_short":"Assoc. Prof.","email":"ndjana.cse@nitdgp.ac.in","phone":"+91-9434788181","joined":2008,"initials":"NJ","color":"#e9c46a","research":["Formal Methods","Software Engineering","Automata Theory"],"subjects":["Formal Languages & Automata","Software Engineering"],"lab":null,"profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p016","name":"Dr. Narayan Murmu","designation":"Assistant Professor","designation_short":"Asst. Prof.","email":"nmurmu.cse@nitdgp.ac.in","phone":"+91-9434788096","joined":2022,"initials":"NM","color":"#4cc9f0","research":["DBMS","Computer Networks","Algorithm Design & Analysis","Functional Programming"],"subjects":["Database Management Systems","Computer Networks"],"lab":"Networking Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p017","name":"Dr. Parag Kumar Guha Thakurta","designation":"Associate Professor","designation_short":"Assoc. Prof.","email":"pkguhathakurta.cse@nitdgp.ac.in","phone":"+91-9434788159","joined":2007,"initials":"PG","color":"#7b2d8b","research":["Recommender Systems","Data Science","Social Network Analysis"],"subjects":["Data Science","Social Networks & Web Mining"],"lab":"Data Science Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p018","name":"Dr. Sumona Mukhopadhyay","designation":"Associate Professor","designation_short":"Assoc. Prof.","email":"smukhopadhyay.cse@nitdgp.ac.in","phone":"+91-9434788177","joined":2001,"initials":"SM","color":"#d62828","research":["Cryptography","Network Security","Information Hiding"],"subjects":["Cryptography & Network Security","Computer Networks"],"lab":"Security Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p019","name":"Dr. Sandip Karmakar","designation":"Assistant Professor","designation_short":"Asst. Prof.","email":"skarmakar.cse@nitdgp.ac.in","phone":"+91-9434789035","joined":2018,"initials":"SK","color":"#0077b6","research":["Wireless Ad Hoc & Sensor Networks","Quality of Service","IoT Security"],"subjects":["Wireless Networks","Internet of Things"],"lab":"Wireless & Sensor Networks Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p020","name":"Dr. Shrutilipi Bhattacharjee","designation":"Associate Professor","designation_short":"Assoc. Prof.","email":"sbhattacharjee.cse@nitdgp.ac.in","phone":"+91-9434789010","joined":2010,"initials":"SB","color":"#52b788","research":["Computational Geometry","Delay Tolerant Networks","Mobile Computing"],"subjects":["Computational Geometry","Advanced Algorithms"],"lab":null,"profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p021","name":"Dr. Subhasish Sadhu","designation":"Associate Professor","designation_short":"Assoc. Prof.","email":"ssadhu.cse@nitdgp.ac.in","phone":"+91-9434788160","joined":2008,"initials":"SS","color":"#f3722c","research":["Image Compression","Image Segmentation","Computer Vision"],"subjects":["Digital Image Processing","Computer Vision"],"lab":"Image Processing Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p022","name":"Dr. Abhijit Sharma","designation":"Assistant Professor","designation_short":"Asst. Prof.","email":"asharma.cse@nitdgp.ac.in","phone":"+91-9434789008","joined":2010,"initials":"AS","color":"#90be6d","research":["Adaptive & Inclusive Technology","Accessibility","HCI"],"subjects":["Human-Computer Interaction","Software Engineering"],"lab":"Accessibility & Inclusive Tech Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p023","name":"Dr. Anuradha Acharyya","designation":"Assistant Professor","designation_short":"Asst. Prof.","email":"aacharyya.cse@nitdgp.ac.in","phone":"+91-9953167384","joined":2022,"initials":"AA","color":"#c77dff","research":["Database Management Systems","Knowledge Systems","Semantic Web"],"subjects":["Database Management Systems","Knowledge Representation"],"lab":null,"profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
  {"id":"p024","name":"Dr. Dilip Kumar Kisku","designation":"Associate Professor","designation_short":"Assoc. Prof.","email":"drkisku.cse@nitdgp.ac.in","phone":"+91-9732111234","joined":2014,"initials":"DK","color":"#e63946","research":["Image Processing","Medical Imaging","Communication Systems","Biometric Security"],"subjects":["Digital Image Processing","Medical Image Analysis"],"lab":"Medical Imaging Lab","profile_url":"https://nitdgp.ac.in/department/computer-science-engineering/faculty-1"},
];

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
  const [professors, setProfessors] = useState<Professor[]>(FALLBACK_PROFESSORS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [desFilter, setDesFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [expFilter, setExpFilter] = useState("Any");
  const [labOnly, setLabOnly] = useState(false);
  const [teachingMe, setTeachingMe] = useState(false);
  const [sortBy, setSortBy] = useState("senior");
  const [selected, setSelected] = useState<Professor | null>(null);

  useEffect(() => {
    supabase
      .from("professors")
      .select("id,name,designation,designation_short,email,phone,joined,initials,color,research,subjects,lab,profile_url")
      .order("joined")
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setProfessors(data as Professor[]);
        }
        setLoading(false);
      });
  }, []);

  const fuse = useMemo(() => new Fuse(professors, {
    keys: ["name", "subjects", "research"],
    threshold: 0.35,
  }), [professors]);

  const filtered = useMemo(() => {
    let list = search.trim() ? fuse.search(search).map(r => r.item) : [...professors];

    if (desFilter !== "All") {
      list = list.filter(p => p.designation_short === desFilter);
    }
    if (deptFilter !== "All") {
      // All profs are CSE for now, so non-CSE returns empty
      if (deptFilter !== "CSE") list = [];
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

    // Sort
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

  const labCount = professors.filter(p => p.lab).length;
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

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="scroll-reveal">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
          <GraduationCap className="h-6 w-6" style={{ color: "hsl(var(--primary))" }} />
          Faculty &amp; Staff — CSE Department
        </h1>
        <p className="text-sm text-muted-foreground mt-1">National Institute of Technology, Durgapur</p>
        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
          <span className="font-medium">{professors.length} Professors</span>
          <span>•</span>
          <span>{labCount} with Labs</span>
          <span>•</span>
          <span>1998–2022</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="scroll-reveal space-y-3" style={{ transitionDelay: "70ms" }}>
        {/* Row 1: Search + Department pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search name, subject, research…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
          {["All", "CSE", "ECE", "EE", "ME"].map(d => (
            <button key={d} onClick={() => setDeptFilter(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${deptFilter === d ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}
            >{d}</button>
          ))}
        </div>

        {/* Row 2: Designation pills + filters + sort */}
        <div className="flex flex-wrap items-center gap-3">
          {["All", "Professor", "Assoc. Prof.", "Asst. Prof."].map(d => (
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
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-56 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          {deptFilter !== "All" && deptFilter !== "CSE"
            ? "No faculty from this department added yet."
            : "No professors match your filters."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <div key={p.id} className="scroll-reveal rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors flex flex-col gap-3" style={{ transitionDelay: `${(i % 6) * 70}ms` }}>
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ backgroundColor: p.color }}>{p.initials}</div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-sm truncate">{p.name}</h3>
                  <Badge className={`mt-1 text-[10px] ${designationBadge(p.designation_short)}`}>{p.designation_short}</Badge>
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

      {/* Slide-over panel */}
      <Sheet open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <div className="space-y-6 pt-2">
              <SheetHeader className="flex-row items-center gap-4 space-y-0">
                <div className="h-20 w-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shrink-0" style={{ backgroundColor: selected.color }}>{selected.initials}</div>
                <div>
                  <SheetTitle className="text-lg">{selected.name}</SheetTitle>
                  <Badge className={`mt-1 ${designationBadge(selected.designation_short)}`}>{selected.designation}</Badge>
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
