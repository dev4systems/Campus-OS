import { useState, useMemo } from "react";
import { examsData } from "@/data/mockData";
import { Calendar, Clock, MapPin, Building2, Armchair, CalendarClock, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";

const typeBadgeClass = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("mid")) return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800";
  if (t.includes("end")) return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800";
  if (t.includes("lab")) return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800";
  if (t.includes("ca")) return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800";
  if (t.includes("quiz")) return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-700";
  return "bg-muted text-muted-foreground border-border";
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", weekday: "long" });
};

const TYPE_FILTERS = ["All Types", "Mid-Sem", "End-Sem", "Lab Exam", "CA", "Quiz"];

const matchesTypeFilter = (examType: string, filter: string) => {
  if (filter === "All Types") return true;
  const t = examType.toLowerCase();
  const f = filter.toLowerCase();
  if (f === "mid-sem") return t.includes("mid");
  if (f === "end-sem") return t.includes("end");
  if (f === "lab exam") return t.includes("lab");
  if (f === "ca") return t === "ca" || t.includes("continuous");
  if (f === "quiz") return t.includes("quiz");
  return false;
};

interface ExamCardProps {
  exam: typeof examsData[0];
  category: "thisMonth" | "upcoming" | "past";
  index: number;
}

const ExamCard = ({ exam, category, index }: ExamCardProps) => {
  const today = new Date();
  const examDate = new Date(exam.date);
  const diffDays = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isPast = examDate < today;

  return (
    <div className="scroll-reveal rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors" style={{ transitionDelay: `${(index % 6) * 70}ms` }}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`text-xs border ${typeBadgeClass(exam.type)}`}>{exam.type}</Badge>
            {category === "past" && (
              <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800 text-xs border">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
              </Badge>
            )}
            {!isPast && diffDays <= 2 && (
              <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 text-xs border">in {diffDays} day{diffDays !== 1 ? "s" : ""}</Badge>
            )}
            {!isPast && diffDays > 2 && diffDays <= 7 && (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 text-xs border">in {diffDays} days</Badge>
            )}
            {!isPast && diffDays > 7 && (
              <span className="text-xs text-muted-foreground">in {diffDays} days</span>
            )}
          </div>
          <h3 className="font-semibold text-foreground">{exam.subject}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(exam.date)}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {exam.time}</span>
            <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {exam.building}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {exam.room}</span>
            <span className="flex items-center gap-1"><Armchair className="h-3.5 w-3.5" /> {exam.seat}</span>
          </div>
          {category === "past" && (
            <p className="text-xs text-muted-foreground italic">Results Awaited</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Exams = () => {
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [showPast, setShowPast] = useState(false);

  const allFiltered = useMemo(() => {
    return examsData.filter(e => matchesTypeFilter(e.type, typeFilter));
  }, [typeFilter]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const { thisMonth, upcoming, past } = useMemo(() => {
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const thisMonth: typeof examsData = [];
    const upcoming: typeof examsData = [];
    const past: typeof examsData = [];

    for (const exam of allFiltered) {
      const d = new Date(exam.date);
      const eMonth = d.getMonth();
      const eYear = d.getFullYear();

      if (eMonth === currentMonth && eYear === currentYear) {
        thisMonth.push(exam);
      } else if (d > today) {
        upcoming.push(exam);
      } else {
        past.push(exam);
      }
    }

    thisMonth.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { thisMonth, upcoming, past };
  }, [allFiltered, today]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="scroll-reveal">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <CalendarClock className="h-6 w-6" style={{ color: "hsl(var(--primary))" }} />
          Examinations
        </h1>
        <p className="text-sm text-muted-foreground">Exam schedule and results</p>
      </div>

      {/* Type filter pills */}
      <div className="scroll-reveal flex flex-wrap items-center gap-2" style={{ transitionDelay: "70ms" }}>
        {TYPE_FILTERS.map(f => (
          <button key={f} onClick={() => setTypeFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${typeFilter === f ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40"}`}
          >{f}</button>
        ))}
      </div>

      {/* This Month */}
      {thisMonth.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">This Month</h2>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">{thisMonth.length}</Badge>
          </div>
          {thisMonth.map((exam, i) => {
            const isPast = new Date(exam.date) < today;
            return <ExamCard key={i} exam={exam} category={isPast ? "past" : "thisMonth"} index={i} />;
          })}
        </div>
      )}

      {/* Upcoming */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Upcoming</h2>
        {upcoming.length === 0 ? (
          <EmptyState icon={CalendarClock} title="No upcoming exams scheduled" subtitle="Future exams beyond this month will appear here." />
        ) : (
          upcoming.map((exam, i) => <ExamCard key={i} exam={exam} category="upcoming" index={i} />)
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div className="space-y-3">
          <Button variant="ghost" size="sm" className="text-sm text-muted-foreground gap-1" onClick={() => setShowPast(!showPast)}>
            Past Exams
            <Badge variant="secondary" className="text-[10px] ml-1">{past.length}</Badge>
            {showPast ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          {showPast && past.map((exam, i) => <ExamCard key={i} exam={exam} category="past" index={i} />)}
        </div>
      )}
    </div>
  );
};

export default Exams;
