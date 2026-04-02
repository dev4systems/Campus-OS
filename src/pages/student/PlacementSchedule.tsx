import { CalendarClock } from "lucide-react";

const PlacementSchedule = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold flex items-center gap-2">
      <CalendarClock className="h-6 w-6" style={{ color: "hsl(var(--primary))" }} />
      My Schedule
    </h1>
    <div className="text-center py-16 text-muted-foreground">
      <CalendarClock className="mx-auto h-12 w-12 mb-3 opacity-40" />
      <p>Your placement schedule will appear here.</p>
    </div>
  </div>
);

export default PlacementSchedule;
