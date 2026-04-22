import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTimetable } from "@/hooks/useTimetable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Printer, Info } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
const SLOTS = [1, 2, 3, 4, 5, 6, 7, 8];
const SLOT_TIMES = [
  "08:00 - 08:55",
  "09:00 - 09:55",
  "10:00 - 10:55",
  "11:00 - 11:55",
  "13:00 - 13:55",
  "14:00 - 14:55",
  "15:00 - 15:55",
  "16:00 - 16:55",
];

export default function Timetable() {
  const { user } = useAuth();
  const [dept, setDept] = useState(user?.department || "CSE");
  const [sem, setSem] = useState(user?.semester?.toString() || "5");
  const [section, setSection] = useState("A");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("nexus_timetable_prefs");
    if (saved) {
      const { d, s, sec } = JSON.parse(saved);
      if (d) setDept(d);
      if (s) setSem(s);
      if (sec) setSection(sec);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("nexus_timetable_prefs", JSON.stringify({ d: dept, s: sem, sec: section }));
  }, [dept, sem, section]);

  const { data: slots = [], isLoading } = useTimetable(dept, parseInt(sem), section);

  const grid = useMemo(() => {
    const g: Record<string, Record<number, any>> = {};
    DAYS.forEach(d => {
      g[d] = {};
      SLOTS.forEach(s => {
        g[d][s] = slots.find(slot => slot.day_of_week === d && slot.slot_number === s);
      });
    });
    return g;
  }, [slots]);

  const today = DAYS[new Date().getDay() - 1] || 'MON'; // 1-6 for Mon-Sat
  const currentSlotIndex = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const totalMinutes = currentHour * 60 + currentMinute;
    
    // Simple heuristic for current slot based on SLOT_TIMES
    if (totalMinutes >= 8 * 60 && totalMinutes < 8 * 60 + 55) return 1;
    if (totalMinutes >= 9 * 60 && totalMinutes < 9 * 60 + 55) return 2;
    if (totalMinutes >= 10 * 60 && totalMinutes < 10 * 60 + 55) return 3;
    if (totalMinutes >= 11 * 60 && totalMinutes < 11 * 60 + 55) return 4;
    if (totalMinutes >= 13 * 60 && totalMinutes < 13 * 60 + 55) return 5;
    if (totalMinutes >= 14 * 60 && totalMinutes < 14 * 60 + 55) return 6;
    if (totalMinutes >= 15 * 60 && totalMinutes < 15 * 60 + 55) return 7;
    if (totalMinutes >= 16 * 60 && totalMinutes < 16 * 60 + 55) return 8;
    return -1;
  }, []);

  const exportPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF('landscape');
    doc.setFontSize(18);
    doc.text(`NIT Durgapur - Timetable (${dept} Sem ${sem} Sec ${section})`, 14, 20);
    
    const tableBody = SLOTS.map(slotNum => {
      const row = [SLOT_TIMES[slotNum-1]];
      DAYS.forEach(day => {
        const slot = grid[day][slotNum];
        row.push(slot ? `${slot.subject_code}\n${slot.room || ''}` : '-');
      });
      return row;
    });

    autoTable(doc, {
      startY: 30,
      head: [['Time', ...DAYS]],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [29, 53, 87] },
      styles: { fontSize: 8, halign: 'center' },
    });

    doc.save(`timetable_${dept}_S${sem}_${section}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Timetable</h1>
          <p className="text-sm text-muted-foreground">Weekly academic schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportPDF}>
            <Download className="h-4 w-4 mr-2" /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="hidden sm:flex">
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 p-4 bg-card rounded-xl border border-border">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Dept</label>
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CSE">CSE</SelectItem>
              <SelectItem value="ECE">ECE</SelectItem>
              <SelectItem value="EE">EE</SelectItem>
              <SelectItem value="ME">ME</SelectItem>
              <SelectItem value="CE">Civil</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Semester</label>
          <Select value={sem} onValueChange={setSem}>
            <SelectTrigger className="w-[100px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Section</label>
          <Select value={section} onValueChange={setSection}>
            <SelectTrigger className="w-[100px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Sec A</SelectItem>
              <SelectItem value="B">Sec B</SelectItem>
              <SelectItem value="C">Sec C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[800px] grid grid-cols-7 gap-px bg-border border border-border rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-muted/50 p-4 text-center font-bold text-xs uppercase text-muted-foreground">Time</div>
            {DAYS.map(day => (
              <div 
                key={day} 
                className={cn(
                  "p-4 text-center font-bold text-xs uppercase",
                  today === day ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
                )}
              >
                {day}
              </div>
            ))}

            {/* Grid Rows */}
            {SLOTS.map(slotNum => (
              <>
                <div key={`time-${slotNum}`} className="bg-card p-4 flex flex-col justify-center items-center text-[10px] font-medium text-muted-foreground border-t border-border">
                  <span className="font-bold">Slot {slotNum}</span>
                  <span>{SLOT_TIMES[slotNum-1]}</span>
                </div>
                {DAYS.map(day => {
                  const slot = grid[day][slotNum];
                  const isCurrent = today === day && currentSlotIndex === slotNum;
                  return (
                    <div 
                      key={`${day}-${slotNum}`} 
                      className={cn(
                        "bg-card p-3 min-h-[100px] relative transition-colors border-t border-border",
                        today === day && "bg-primary/5"
                      )}
                    >
                      {isCurrent && (
                        <motion.div 
                          className="absolute inset-1 border-2 border-primary rounded-lg z-10"
                          initial={{ opacity: 0.5 }}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      {slot ? (
                        <div className="h-full flex flex-col justify-between space-y-2">
                          <div>
                            <p className="text-xs font-bold text-foreground leading-tight">{slot.subject_code}</p>
                            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{slot.subject_name}</p>
                          </div>
                          <div className="pt-2 border-t border-border/50">
                            <p className="text-[10px] font-medium text-foreground flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-primary" /> {slot.profiles?.full_name || 'TBA'}
                            </p>
                            <p className="text-[9px] text-muted-foreground mt-1 flex items-center gap-1">
                              <Info className="h-3 w-3" /> {slot.room || 'TBA'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center opacity-20">
                          <span className="text-[10px] font-medium">-</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
iv>
        </div>
      )}
    </div>
  );
}
