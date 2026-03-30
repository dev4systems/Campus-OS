import { useState } from "react";
import { timetableData } from "@/data/mockData";
import { MapPin, Clock, User, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Timetable = () => {
  const days = timetableData.map((d) => d.day);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const [selectedDay, setSelectedDay] = useState(days.includes(today) ? today : days[0]);
  const dayData = timetableData.find((d) => d.day === selectedDay);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Timetable</h1>
        <p className="text-sm text-muted-foreground">Your weekly class schedule</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              selectedDay === day ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {dayData?.slots.map((slot, i) => (
          <div key={i} className="scroll-reveal rounded-xl border border-border bg-card p-4 sm:p-5 hover:border-primary/30 transition-colors" style={{ transitionDelay: `${i * 70}ms` }}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={slot.type === "Lab" ? "secondary" : "outline"} className="text-xs">
                    {slot.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-4 w-4" /> {slot.time}</span>
                </div>
                <h3 className="font-semibold text-foreground">{slot.subject}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="h-4 w-4" /> {slot.professor}</span>
                  <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {slot.building}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {slot.room}</span>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors self-start">
                <MapPin className="h-4 w-4" /> Directions
              </button>
            </div>
          </div>
        ))}
        {(!dayData || dayData.slots.length === 0) && (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">No classes scheduled</div>
        )}
      </div>
    </div>
  );
};

export default Timetable;
