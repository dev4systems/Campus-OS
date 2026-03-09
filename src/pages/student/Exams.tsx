import { examsData } from "@/data/mockData";
import { Calendar, Clock, MapPin, Building2, Armchair } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Exams = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Examinations</h1>
        <p className="text-sm text-muted-foreground">Upcoming exams and schedules</p>
      </div>

      <div className="space-y-3">
        {examsData.map((exam, i) => {
          const daysLeft = Math.ceil((new Date(exam.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return (
            <div key={i} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{exam.type}</Badge>
                    {daysLeft > 0 && daysLeft <= 7 && <Badge className="bg-status-warning/10 text-status-warning border-status-warning/20 text-xs">{daysLeft} days left</Badge>}
                  </div>
                  <h3 className="font-semibold text-foreground">{exam.subject}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {exam.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {exam.time}</span>
                    <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {exam.building}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {exam.room}</span>
                    <span className="flex items-center gap-1"><Armchair className="h-3 w-3" /> {exam.seat}</span>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors self-start shrink-0">
                  <MapPin className="h-3 w-3" /> Directions
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Exams;
