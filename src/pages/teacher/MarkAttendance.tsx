import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFacultyCourses, useCourseStudents, useAttendanceForDate, useMarkAttendance } from "@/hooks/useAttendance";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/skeletons/PageSkeleton";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Download } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Attendance, Profile } from "@/types";
import { exportToCSV } from "@/lib/export";

export default function MarkAttendance() {
  const { user } = useAuth();
  const { data: courses = [], isLoading: coursesLoading } = useFacultyCourses(user?.id);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  
  const { data: students = [] as Profile[], isLoading: studentsLoading } = useCourseStudents(selectedCourse);
  const dateStr = format(date, "yyyy-MM-dd");
  
  const { data: existingAttendance = [], isLoading: attendanceLoading } = useAttendanceForDate(selectedCourse, dateStr);
  const { mutate: submitAttendance, isPending: isSubmitting } = useMarkAttendance();

  // Local state to hold the edits before submission
  const [draft, setDraft] = useState<Record<string, Attendance['status']>>({});

  // Sync draft with existing attendance when data loads or selection changes
  useEffect(() => {
    const newDraft: Record<string, Attendance['status']> = {};
    existingAttendance.forEach(a => {
      newDraft[a.student_id] = a.status;
    });
    setDraft(newDraft);
  }, [existingAttendance, selectedCourse, dateStr]);

  const handleMarkAll = (status: Attendance['status']) => {
    const newDraft = { ...draft };
    (students as Profile[]).forEach((s) => {
      newDraft[s.id] = status;
    });
    setDraft(newDraft);
  };

  const handleExport = () => {
    if (!students || students.length === 0) return;
    const exportData = (students as Profile[]).map(s => ({
      "Roll No": s.roll_no || 'N/A',
      "Name": s.full_name || s.email,
      "Status": draft[s.id] ? draft[s.id].toUpperCase() : 'ABSENT',
      "Date": dateStr,
      "Course ID": selectedCourse
    }));
    exportToCSV(exportData, `Attendance_${selectedCourse}_${dateStr}`);
  };

  const handleSubmit = () => {
    if (!selectedCourse) return;
    
    const records: Partial<Attendance>[] = (students as Profile[]).map((s) => ({
      student_id: s.id,
      course_id: selectedCourse,
      faculty_id: user!.id,
      date: dateStr,
      status: draft[s.id] || 'absent' // default to absent if unmarked
    }));

    submitAttendance(records, {
      onSuccess: () => toast.success("Attendance saved successfully"),
      onError: (err) => toast.error(`Failed to save: ${err.message}`)
    });
  };

  if (coursesLoading) return <div className="space-y-4"><Skeleton className="h-12 w-full"/><Skeleton className="h-64 w-full"/></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mark Attendance</h1>
        <p className="text-sm text-muted-foreground">Record daily attendance for your classes</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-border">
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.code} - {c.name}</SelectItem>
            ))}
            {courses.length === 0 && <SelectItem value="none" disabled>No courses found</SelectItem>}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"outline"} className={cn("w-full sm:w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
          </PopoverContent>
        </Popover>

        {selectedCourse && (
          <div className="ml-auto flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={() => handleMarkAll('present')} className="flex-1 sm:flex-none text-green-600 border-green-600/20 hover:bg-green-600/10">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Mark All P
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleMarkAll('absent')} className="flex-1 sm:flex-none text-red-600 border-red-600/20 hover:bg-red-600/10">
              <XCircle className="w-4 h-4 mr-1" /> Mark All A
            </Button>
          </div>
        )}
      </div>

      {!selectedCourse ? (
        <div className="text-center py-12 text-muted-foreground">Select a course to mark attendance.</div>
      ) : studentsLoading || attendanceLoading ? (
        <TableSkeleton />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 font-medium">Roll No</th>
                    <th className="px-4 py-3 font-medium">Student Name</th>
                    <th className="px-4 py-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.map((student: any) => (
                    <tr key={student.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 whitespace-nowrap font-mono">{student.roll_no || 'N/A'}</td>
                      <td className="px-4 py-3 font-medium">{student.full_name || student.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => setDraft(prev => ({...prev, [student.id]: 'present'}))}
                            className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", draft[student.id] === 'present' ? "bg-green-500 text-white" : "bg-muted text-muted-foreground hover:bg-green-500/20 hover:text-green-500")}
                            title="Present"
                          >
                            P
                          </button>
                          <button 
                            onClick={() => setDraft(prev => ({...prev, [student.id]: 'late'}))}
                            className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", draft[student.id] === 'late' ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground hover:bg-amber-500/20 hover:text-amber-500")}
                            title="Late"
                          >
                            L
                          </button>
                          <button 
                            onClick={() => setDraft(prev => ({...prev, [student.id]: 'absent'}))}
                            className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", draft[student.id] === 'absent' ? "bg-red-500 text-white" : "bg-muted text-muted-foreground hover:bg-red-500/20 hover:text-red-500")}
                            title="Absent"
                          >
                            A
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No students enrolled in this course.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-border flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitting || students.length === 0}>
                {isSubmitting ? "Saving..." : existingAttendance.length > 0 ? "Update Attendance" : "Save Attendance"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
