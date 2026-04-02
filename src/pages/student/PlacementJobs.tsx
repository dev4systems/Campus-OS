import { useState } from "react";
import {
  Briefcase, MapPin, Calendar, Users, ChevronRight, Search,
  X, Clock, Building2, GraduationCap, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Company {
  id: string;
  company: string;
  logo_initial: string;
  logo_color: string;
  role: string;
  type: string;
  sector: string;
  salary: { min: number; max: number; currency: string };
  cgpa_cutoff: number;
  backlog_allowed: boolean;
  branches: string[];
  batch: string;
  location: string;
  description: string;
  requirements: string[];
  rounds: string[];
  drive_date: string;
  registration_deadline: string;
  status: string;
  applied_count: number;
}

const COMPANIES: Company[] = [
  {
    id: "c001",
    company: "Microsoft",
    logo_initial: "MS",
    logo_color: "#00a4ef",
    role: "Software Development Engineer (SDE-1)",
    type: "Full Time",
    sector: "Product",
    salary: { min: 40, max: 58, currency: "LPA" },
    cgpa_cutoff: 7.5,
    backlog_allowed: false,
    branches: ["CSE", "ECE", "EE"],
    batch: "2025-26",
    location: "Hyderabad / Bengaluru",
    description: "Join Microsoft's engineering teams to build cloud-scale systems on Azure, Office 365, and Xbox platforms. You'll design, develop, and test large-scale distributed software. Expect to work on high-impact features shipped to hundreds of millions of users globally.",
    requirements: ["Strong DSA fundamentals (Arrays, Trees, Graphs, DP)", "Proficiency in C++, Java, or Python", "Understanding of OS, DBMS, Computer Networks", "System design basics"],
    rounds: ["Online Coding (90 min)", "Technical Interview 1", "Technical Interview 2", "HR Round"],
    drive_date: "2025-08-10",
    registration_deadline: "2025-07-28",
    status: "upcoming",
    applied_count: 142,
  },
  {
    id: "c002",
    company: "Amazon",
    logo_initial: "AMZ",
    logo_color: "#FF9900",
    role: "SDE-1 / SDE Intern",
    type: "Full Time",
    sector: "Product",
    salary: { min: 32, max: 44, currency: "LPA" },
    cgpa_cutoff: 7.0,
    backlog_allowed: false,
    branches: ["CSE", "ECE", "EE", "ME"],
    batch: "2025-26",
    location: "Hyderabad / Bengaluru / Chennai",
    description: "Work on Amazon's core e-commerce platform, AWS services, or Alexa. SDEs at Amazon own full problem-to-production cycles — you'll write the code, test it, and deploy it. Amazon's leadership principles are central to their hiring process.",
    requirements: ["Strong problem-solving with DSA", "OOP concepts in any language", "Familiarity with Linux/Unix systems", "Leadership principles alignment"],
    rounds: ["Online Assessment (2 coding + 1 work simulation)", "Technical Interview 1", "Bar Raiser Interview", "HR Round"],
    drive_date: "2025-08-18",
    registration_deadline: "2025-08-04",
    status: "upcoming",
    applied_count: 187,
  },
  {
    id: "c003",
    company: "Goldman Sachs",
    logo_initial: "GS",
    logo_color: "#6699CC",
    role: "Analyst – Engineering",
    type: "Full Time",
    sector: "Finance / Fintech",
    salary: { min: 25, max: 35, currency: "LPA" },
    cgpa_cutoff: 7.5,
    backlog_allowed: false,
    branches: ["CSE", "ECE", "EE", "Mathematics"],
    batch: "2025-26",
    location: "Bengaluru / Hyderabad",
    description: "Goldman Sachs Engineering builds the systems that power global financial markets. As an Analyst you will work on trading platforms, risk engines, and core banking infrastructure. Expect low-latency, high-reliability systems at massive scale.",
    requirements: ["Strong coding in Java or Python", "Data structures and algorithms", "Basic understanding of financial systems is a plus", "Quantitative reasoning skills"],
    rounds: ["HackerRank Online Test", "Technical Round 1", "Technical Round 2", "HR/Culture Fit"],
    drive_date: "2025-09-05",
    registration_deadline: "2025-08-22",
    status: "upcoming",
    applied_count: 98,
  },
  {
    id: "c004",
    company: "JP Morgan Chase",
    logo_initial: "JPM",
    logo_color: "#003087",
    role: "Software Engineer – Full Stack",
    type: "Full Time",
    sector: "Finance / Fintech",
    salary: { min: 20, max: 28, currency: "LPA" },
    cgpa_cutoff: 7.0,
    backlog_allowed: false,
    branches: ["CSE", "ECE", "EE"],
    batch: "2025-26",
    location: "Hyderabad / Mumbai / Bengaluru",
    description: "JPMC's Code for Good and full-time SWE roles involve building next-generation financial services using modern web technologies. You'll work within agile squads developing APIs, dashboards, and internal tooling for one of the world's largest banks.",
    requirements: ["React, Angular or Vue.js front-end skills", "Backend: Java / Spring Boot or Python / FastAPI", "REST API design and SQL/NoSQL databases", "Agile/Scrum methodology"],
    rounds: ["Online Coding Test", "Technical Interview", "HR Interview"],
    drive_date: "2025-09-14",
    registration_deadline: "2025-08-30",
    status: "upcoming",
    applied_count: 115,
  },
  {
    id: "c005",
    company: "Adobe",
    logo_initial: "ADBE",
    logo_color: "#FA0F00",
    role: "Software Development Engineer",
    type: "Full Time",
    sector: "Product",
    salary: { min: 26, max: 38, currency: "LPA" },
    cgpa_cutoff: 7.5,
    backlog_allowed: false,
    branches: ["CSE", "ECE"],
    batch: "2025-26",
    location: "Noida / Bengaluru",
    description: "Adobe hires SDEs to work on Creative Cloud, Document Cloud, and Experience Cloud products. You'll build features used by millions of creators and enterprises. Adobe is known for its strong engineering culture, design thinking, and collaborative environment.",
    requirements: ["Strong C++ or Java programming", "Data structures, algorithms, system design", "Understanding of graphics or multimedia is a plus", "Problem solving with attention to edge cases"],
    rounds: ["Aptitude + Coding Test", "Technical Interview 1 (DSA)", "Technical Interview 2 (System Design)", "HR Round"],
    drive_date: "2025-09-22",
    registration_deadline: "2025-09-08",
    status: "upcoming",
    applied_count: 76,
  },
];

function roleTypeLabel(type: string) {
  if (type.toLowerCase().includes("intern") && !type.toLowerCase().includes("ppo")) return "2 Month Internship";
  if (type.toLowerCase().includes("intern") && type.toLowerCase().includes("ppo")) return "6 Month Internship + PPO";
  if (type.toLowerCase().includes("ppo")) return "6 Month Internship + PPO";
  return "Full Time Role";
}

function roleTypeBadgeClass(type: string) {
  const label = roleTypeLabel(type);
  if (label.includes("PPO")) return "bg-blue-500/15 text-blue-600 border-blue-500/20";
  if (label.includes("2 Month")) return "bg-purple-500/15 text-purple-600 border-purple-500/20";
  return "bg-sky-500/15 text-sky-600 border-sky-500/20";
}

const SECTORS = ["All", "Product", "Finance / Fintech", "IT Services", "Core", "Consulting"];
const CGPA_OPTIONS = ["All", "≥6.0", "≥6.5", "≥7.0", "≥7.5", "≥8.0"];
const BRANCHES = ["All", "CSE", "ECE", "EE", "ME", "CE"];

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

const PlacementJobs = () => {
  const [sector, setSector] = useState("All");
  const [cgpa, setCgpa] = useState("All");
  const [branch, setBranch] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Company | null>(null);

  const filtered = COMPANIES.filter((c) => {
    if (sector !== "All" && !c.sector.includes(sector)) return false;
    if (cgpa !== "All") {
      const min = parseFloat(cgpa.replace("≥", ""));
      if (c.cgpa_cutoff > min) return false;
    }
    if (branch !== "All" && !c.branches.includes(branch)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!c.company.toLowerCase().includes(q) && !c.role.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="scroll-reveal">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="h-6 w-6" style={{ color: "hsl(var(--primary))" }} />
          Placement Drives
        </h1>
        <p className="text-muted-foreground text-sm mt-1">2025–26 Batch</p>
      </div>

      {/* Filters */}
      <div className="scroll-reveal flex flex-wrap gap-3 items-center" style={{ transitionDelay: "70ms" }}>
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sector" /></SelectTrigger>
          <SelectContent>{SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={cgpa} onValueChange={setCgpa}>
          <SelectTrigger className="w-[120px]"><SelectValue placeholder="CGPA" /></SelectTrigger>
          <SelectContent>{CGPA_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger className="w-[120px]"><SelectValue placeholder="Branch" /></SelectTrigger>
          <SelectContent>{BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
        </Select>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search company or role..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground scroll-reveal">
          <Briefcase className="mx-auto h-12 w-12 mb-3 opacity-40" />
          <p>No drives match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c, i) => (
            <Card
              key={c.id}
              className="scroll-reveal hover:shadow-md transition-shadow"
              style={{ transitionDelay: `${(i + 2) * 70}ms` }}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div
                    className="h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: c.logo_color, color: "#fff" }}
                  >
                    {c.logo_initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg leading-tight">{c.company}</h3>
                    <p className="text-sm text-muted-foreground truncate">{c.role}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">
                    ₹{c.salary.min}–{c.salary.max} LPA
                  </Badge>
                  <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/20 hover:bg-amber-500/20">
                    CGPA ≥ {c.cgpa_cutoff}
                  </Badge>
                  {!c.backlog_allowed ? (
                    <Badge className="bg-red-500/15 text-red-600 border-red-500/20 hover:bg-red-500/20">No Backlogs</Badge>
                  ) : (
                    <Badge variant="secondary">Backlogs OK</Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{c.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(c.drive_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {c.branches.map((b) => (
                    <span key={b} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">{b}</span>
                  ))}
                </div>

                <Button variant="outline" className="w-full" onClick={() => setSelected(c)}>
                  View Details <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          {selected && (
            <div className="space-y-6 pb-6">
              <SheetHeader className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
                    style={{ background: selected.logo_color, color: "#fff" }}
                  >
                    {selected.logo_initial}
                  </div>
                  <div>
                    <SheetTitle className="text-xl">{selected.company}</SheetTitle>
                    <p className="text-sm text-muted-foreground">{selected.role}</p>
                    <p className="text-xs text-muted-foreground">{selected.type} · {selected.sector}</p>
                  </div>
                </div>
              </SheetHeader>

              <div className="text-2xl font-bold text-emerald-600">
                ₹{selected.salary.min}–{selected.salary.max} {selected.salary.currency}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />{selected.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />Drive: {new Date(selected.drive_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>Deadline: {new Date(selected.registration_deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    <span className="ml-1 text-amber-600 font-medium">({daysUntil(selected.registration_deadline)}d left)</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4 shrink-0" />CGPA ≥ {selected.cgpa_cutoff}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!selected.backlog_allowed ? (
                  <Badge className="bg-red-500/15 text-red-600 border-red-500/20">
                    <AlertTriangle className="h-3 w-3 mr-1" />No Backlogs
                  </Badge>
                ) : (
                  <Badge variant="secondary"><CheckCircle2 className="h-3 w-3 mr-1" />Backlogs OK</Badge>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Eligible Branches</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selected.branches.map((b) => (
                    <Badge key={b} variant="secondary">{b}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">About this Drive</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{selected.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Requirements</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {selected.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Selection Rounds</h4>
                <ol className="space-y-2">
                  {selected.rounds.map((r, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                      {r}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />{selected.applied_count} students have registered
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  toast.success("Interest registered! You'll be notified before the drive.");
                  setSelected(null);
                }}
              >
                Register Interest
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PlacementJobs;
