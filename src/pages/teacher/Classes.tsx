import { MapPin, Clock, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const classes = [
  { day: "Monday", time: "9:00 - 10:00", subject: "CS301 (Sec A)", room: "LH-201", building: "Lecture Hall Complex", type: "Lecture" },
  { day: "Monday", time: "2:00 - 5:00", subject: "CS301 Lab (Sec A)", room: "CC-Lab 3", building: "Computer Centre", type: "Lab" },
  { day: "Tuesday", time: "11:30 - 12:30", subject: "CS501 (Sec A)", room: "LH-302", building: "Lecture Hall Complex", type: "Lecture" },
  { day: "Wednesday", time: "9:00 - 10:00", subject: "CS301 (Sec B)", room: "LH-203", building: "Lecture Hall Complex", type: "Lecture" },
  { day: "Thursday", time: "10:00 - 11:00", subject: "CS301 (Sec A)", room: "LH-201", building: "Lecture Hall Complex", type: "Lecture" },
  { day: "Thursday", time: "2:00 - 3:00", subject: "CS501 (Sec A)", room: "LH-302", building: "Lecture Hall Complex", type: "Lecture" },
  { day: "Friday", time: "2:00 - 5:00", subject: "CS301 Lab (Sec B)", room: "CC-Lab 2", building: "Computer Centre", type: "Lab" },
];

const Classes = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Classes</h1>
        <p className="text-sm text-muted-foreground">Weekly class schedule</p>
      </div>

      <div className="space-y-3">
        {classes.map((cls, i) => (
          <div key={i} className="scroll-reveal rounded-xl border border-border bg-card p-4 flex items-center justify-between hover:border-primary/30 transition-colors" style={{ transitionDelay: `${i * 70}ms` }}>
            <div className="flex items-center gap-4">
              <div className="text-center min-w-[60px]">
                <p className="text-xs font-semibold text-primary">{cls.day.slice(0, 3)}</p>
                <p className="text-[10px] text-muted-foreground">{cls.time.split(" - ")[0]}</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{cls.subject}</h3>
                  <Badge variant={cls.type === "Lab" ? "secondary" : "outline"} className="text-[10px]">{cls.type}</Badge>
                </div>
                <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {cls.time}</span>
                  <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {cls.room}</span>
                </div>
              </div>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
              <MapPin className="h-4 w-4" /> Map
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;
