import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentAttendance } from "@/hooks/useAttendance";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_COLORS = {
  present: "#22c55e",
  absent: "#ef4444",
  late: "#f59e0b",
};

import { usePageView } from "@/hooks/useAnalytics";

export default function StudentAttendance() {
  usePageView('Attendance Tracker');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: attendance = [], isLoading } = useStudentAttendance(user?.id);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  // Realtime updates
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel('attendance-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'attendance', filter: `student_id=eq.${user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["attendance", "student", user.id] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, queryClient]);

  const stats = useMemo(() => {
    const subjectStats: Record<string, { total: number, present: number, absent: number, late: number, name: string }> = {};
    let totalClasses = 0;
    let totalPresent = 0;

    attendance.forEach(record => {
      const subName = record.courses?.name || record.course_id;
      if (!subjectStats[subName]) {
        subjectStats[subName] = { total: 0, present: 0, absent: 0, late: 0, name: subName };
      }
      subjectStats[subName].total++;
      totalClasses++;
      if (record.status === "present") {
        subjectStats[subName].present++;
        totalPresent++;
      } else if (record.status === "late") {
        subjectStats[subName].late++;
        totalPresent += 0.5; // Example logic: late counts as 0.5 present, or maybe full present but flagged
      } else {
        subjectStats[subName].absent++;
      }
    });

    const overall = totalClasses === 0 ? 0 : (totalPresent / totalClasses) * 100;
    
    const subjectsArray = Object.values(subjectStats).map(stat => {
      // For charting, let's treat late as a separate piece of the pie
      const pct = stat.total === 0 ? 0 : ((stat.present + stat.late) / stat.total) * 100;
      return { ...stat, percentage: pct };
    });

    return { overall, subjects: subjectsArray, totalClasses };
  }, [attendance]);

  const filteredHistory = useMemo(() => {
    if (selectedMonth === "all") return attendance;
    return attendance.filter(a => new Date(a.date).getMonth() === parseInt(selectedMonth));
  }, [attendance, selectedMonth]);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-32 w-full"/><Skeleton className="h-64 w-full"/></div>;

  const getStatusColor = (pct: number) => {
    if (pct >= 75) return "text-green-500";
    if (pct >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const hasWarnings = stats.subjects.some(s => s.percentage < 75);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Attendance Tracker</h1>
        <p className="text-sm text-muted-foreground">Monitor your daily attendance</p>
      </div>

      {hasWarnings && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">Warning: One or more subjects are below the 75% attendance threshold.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-1">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <h2 className="text-lg font-semibold mb-2">Overall Attendance</h2>
            <div className={`text-5xl font-bold ${getStatusColor(stats.overall)}`}>
              {stats.overall.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-2">{stats.totalClasses} total classes</p>
          </CardContent>
        </Card>

        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.subjects.map(sub => (
            <Card key={sub.name}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-tight truncate w-32" title={sub.name}>{sub.name}</p>
                  <p className={`text-xl font-bold ${getStatusColor(sub.percentage)}`}>{sub.percentage.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">{sub.present}P {sub.late > 0 && `${sub.late}L`} {sub.absent}A</p>
                </div>
                <div className="h-20 w-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Present', value: sub.present, color: STATUS_COLORS.present },
                          { name: 'Late', value: sub.late, color: STATUS_COLORS.late },
                          { name: 'Absent', value: sub.absent, color: STATUS_COLORS.absent }
                        ]}
                        innerRadius={25}
                        outerRadius={35}
                        dataKey="value"
                        stroke="none"
                      >
                        {[
                          { name: 'Present', value: sub.present, color: STATUS_COLORS.present },
                          { name: 'Late', value: sub.late, color: STATUS_COLORS.late },
                          { name: 'Absent', value: sub.absent, color: STATUS_COLORS.absent }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-semibold">History</h2>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {Array.from({length: 12}).map((_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {new Date(0, i).toLocaleString('default', { month: 'short' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredHistory.map((record) => (
                <tr key={record.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 font-medium">{record.courses?.name || record.course_id}</td>
                  <td className="px-4 py-3">
                    {record.status === "present" && <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle2 className="w-3 h-3 mr-1"/> Present</Badge>}
                    {record.status === "absent" && <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20"><XCircle className="w-3 h-3 mr-1"/> Absent</Badge>}
                    {record.status === "late" && <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20"><Clock className="w-3 h-3 mr-1"/> Late</Badge>}
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                    No attendance records found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
