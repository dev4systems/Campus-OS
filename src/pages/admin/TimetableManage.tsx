import { useState, useMemo } from "react";
import { useTimetable, useUpsertTimetableSlot } from "@/hooks/useTimetable";
import { useProfessors } from "@/hooks/useProfessors";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TimetableSlotRecord, checkFacultyConflict } from "@/services/timetable.service";

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

export default function TimetableManage() {
  const [dept, setDept] = useState("CSE");
  const [sem, setSem] = useState("5");
  const [section, setSection] = useState("A");

  const { data: slots = [], isLoading } = useTimetable(dept, parseInt(sem), section);
  const { data: professors = [] } = useProfessors();
  const { mutate: upsertSlot, isPending: isSaving } = useUpsertTimetableSlot();

  const [editingSlot, setEditingSlot] = useState<TimetableSlotRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleCellClick = (day: typeof DAYS[number], slotNum: number) => {
    const existing = grid[day][slotNum];
    setEditingSlot(existing || {
      department: dept,
      semester: parseInt(sem),
      section: section,
      day_of_week: day,
      slot_number: slotNum,
      subject_name: "",
      subject_code: "",
      faculty_id: null,
      room: "",
      status: 'published'
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingSlot) return;
    if (!editingSlot.subject_code || !editingSlot.subject_name) {
      toast.error("Subject details are required");
      return;
    }

    // Conflict detection
    if (editingSlot.faculty_id) {
      const conflicts = await checkFacultyConflict(
        editingSlot.faculty_id, 
        editingSlot.day_of_week, 
        editingSlot.slot_number,
        editingSlot.id
      );
      if (conflicts && conflicts.length > 0) {
        const c = conflicts[0];
        toast.error(`Faculty Conflict: Professor is already teaching ${c.subject_name} for ${c.department} S${c.semester} Sec ${c.section} at this time.`);
        return;
      }
    }

    upsertSlot(editingSlot, {
      onSuccess: () => {
        toast.success("Slot saved successfully");
        setIsDialogOpen(false);
      },
      onError: (err) => toast.error(`Error saving: ${err.message}`)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Timetable Builder</h1>
          <p className="text-sm text-muted-foreground">Manage academic schedule and detect conflicts</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 p-4 bg-card rounded-xl border border-border">
        <Select value={dept} onValueChange={setDept}>
          <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="CSE">CSE</SelectItem>
            <SelectItem value="ECE">ECE</SelectItem>
            <SelectItem value="EE">EE</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sem} onValueChange={setSem}>
          <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={section} onValueChange={setSection}>
          <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="A">Sec A</SelectItem>
            <SelectItem value="B">Sec B</SelectItem>
            <SelectItem value="C">Sec C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-[500px] w-full" />
      ) : (
        <div className="overflow-x-auto border border-border rounded-2xl">
          <div className="min-w-[900px] grid grid-cols-7 gap-px bg-border">
            <div className="bg-muted/50 p-4 text-center font-bold text-xs uppercase text-muted-foreground">Slot</div>
            {DAYS.map(day => <div key={day} className="bg-muted/50 p-4 text-center font-bold text-xs uppercase text-muted-foreground">{day}</div>)}

            {SLOTS.map(slotNum => (
              <>
                <div key={`time-${slotNum}`} className="bg-card p-4 flex flex-col justify-center items-center text-[10px] font-medium text-muted-foreground">
                  <span className="font-bold">#{slotNum}</span>
                  <span>{SLOT_TIMES[slotNum-1]}</span>
                </div>
                {DAYS.map(day => {
                  const slot = grid[day][slotNum];
                  return (
                    <button 
                      key={`${day}-${slotNum}`} 
                      onClick={() => handleCellClick(day, slotNum)}
                      className="bg-card p-3 min-h-[100px] text-left hover:bg-muted/30 transition-colors group relative"
                    >
                      {slot ? (
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-foreground truncate">{slot.subject_code}</p>
                          <p className="text-[10px] text-muted-foreground line-clamp-2">{slot.subject_name}</p>
                          <p className="text-[9px] font-medium text-primary mt-2">{slot.profiles?.full_name}</p>
                          <p className="text-[9px] text-muted-foreground">{slot.room}</p>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="text-[10px] text-primary font-bold">+ ADD</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Slot: {editingSlot?.day_of_week} #{editingSlot?.slot_number}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right text-xs">Code</Label>
              <Input id="code" value={editingSlot?.subject_code} onChange={e => setEditingSlot(p => p ? {...p, subject_code: e.target.value} : null)} className="col-span-3 h-8 text-xs" placeholder="CS301" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-xs">Subject</Label>
              <Input id="name" value={editingSlot?.subject_name} onChange={e => setEditingSlot(p => p ? {...p, subject_name: e.target.value} : null)} className="col-span-3 h-8 text-xs" placeholder="Algorithms" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="faculty" className="text-right text-xs">Faculty</Label>
              <div className="col-span-3">
                <Select value={editingSlot?.faculty_id || "none"} onValueChange={v => setEditingSlot(p => p ? {...p, faculty_id: v === "none" ? null : v} : null)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Faculty</SelectItem>
                    {professors.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right text-xs">Room</Label>
              <Input id="room" value={editingSlot?.room || ""} onChange={e => setEditingSlot(p => p ? {...p, room: e.target.value} : null)} className="col-span-3 h-8 text-xs" placeholder="MAB-201" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save Slot"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
