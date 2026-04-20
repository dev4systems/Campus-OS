import { useState, useMemo, useEffect } from "react";
import {
  Briefcase, Calendar, Users, ChevronRight, Search,
  Bell, BellOff, BarChart3
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlacementDrives, useStudentPlacementNotifications, useTogglePlacementNotification } from "@/hooks/usePlacements";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlacementDrive, PlacementRound } from "@/types";

const CGPA_OPTIONS = ["All", "≥6.0", "≥6.5", "≥7.0", "≥7.5", "≥8.0"];
const BRANCHES = ["All", "CSE", "ECE", "EE", "ME", "CE"];

const PlacementJobs = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: drives = [], isLoading } = usePlacementDrives();
  const { data: notifications = [] } = useStudentPlacementNotifications(user?.id);
  const { mutate: toggleNotify, isPending: isToggling } = useTogglePlacementNotification();

  const [cgpa, setCgpa] = useState("All");
  const [branch, setBranch] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PlacementDrive | null>(null);

  // Realtime subscription for round status changes
  useEffect(() => {
    const channel = supabase
      .channel('placement-round-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'placement_rounds' }, (payload: any) => {
        const round = payload.new;
        // Find if user is subscribed to this drive
        if (notifications.includes(round.drive_id)) {
          toast(`Round Update: ${round.round_name} is now ${round.status}`, {
            icon: <Bell className="h-4 w-4" />,
          });
        }
        queryClient.invalidateQueries({ queryKey: ["placement-drives"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [notifications, queryClient]);

  const filtered = useMemo(() => {
    return drives.filter((d: PlacementDrive) => {
      if (cgpa !== "All") {
        const min = parseFloat(cgpa.replace("≥", ""));
        if (d.minimum_cgpa > min) return false;
      }
      if (branch !== "All" && !d.eligible_branches.includes(branch)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!d.company_name.toLowerCase().includes(q) && !d.role.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [drives, cgpa, branch, search]);

  const statsData = useMemo(() => {
    const years = [...new Set(drives.map(d => d.year))].sort();
    return years.map(y => {
      const yearDrives = drives.filter(d => d.year === y);
      return {
        year: y.toString(),
        count: yearDrives.length,
        avgPackage: yearDrives.reduce((acc, d) => acc + (d.package_max || 0), 0) / (yearDrives.length || 1)
      };
    });
  }, [drives]);

  const isSubscribed = (driveId: string) => notifications.includes(driveId);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-20 w-full"/><div className="grid grid-cols-2 gap-4"><Skeleton className="h-48"/><Skeleton className="h-48"/></div></div>;

  return (
    <div className="space-y-6">
      <div className="scroll-reveal">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          Placement Intelligence
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time drive tracking & analytics</p>
      </div>

      <div className="scroll-reveal flex flex-wrap gap-3 items-center">
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
          <Input placeholder="Search company or role..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((d: PlacementDrive) => (
          <Card key={d.id} className="hover:border-primary/30 transition-all group">
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {d.company_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground leading-none">{d.company_name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{d.role}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={isSubscribed(d.id) ? "text-primary bg-primary/5" : "text-muted-foreground"}
                  onClick={() => user?.id && toggleNotify({ studentId: user.id, driveId: d.id })}
                  disabled={isToggling}
                >
                  {isSubscribed(d.id) ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">₹{d.package_min}-{d.package_max} LPA</Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">CGPA {d.minimum_cgpa}+</Badge>
                <Badge className={d.status === 'active' ? 'bg-orange-500' : 'bg-muted text-muted-foreground'}>{d.status}</Badge>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-bold">ST</div>)}
                  <div className="w-6 h-6 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">+12</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setSelected(d)}>Timeline <ChevronRight className="h-3 w-3 ml-1"/></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="pt-8 space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Historical Statistics
        </h2>
        <Card className="p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Drives" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Sheet open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selected && (
            <div className="space-y-8 pt-4">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold">{selected.company_name}</SheetTitle>
                <p className="text-muted-foreground">{selected.role}</p>
              </SheetHeader>

              <div className="relative pl-6 space-y-8 border-l-2 border-muted ml-3">
                {(selected.placement_rounds || []).sort((a: PlacementRound, b: PlacementRound) => a.sequence_order - b.sequence_order).map((round: PlacementRound) => (
                  <div key={round.id} className="relative">
                    <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 border-background ${round.status === 'completed' ? 'bg-green-500' : round.status === 'ongoing' ? 'bg-orange-500 animate-pulse' : 'bg-muted'}`} />
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm">{round.round_name}</h4>
                        <Badge variant="outline" className="text-[10px]">{round.status}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/> {round.round_date ? new Date(round.round_date).toLocaleDateString() : 'TBD'}</span>
                        {round.selected_count && <span className="flex items-center gap-1"><Users className="h-3 w-3"/> {round.selected_count} cleared</span>}
                      </div>
                      {round.notes && <p className="text-xs bg-muted/30 p-2 rounded mt-2 border border-border/50 italic text-muted-foreground">{round.notes}</p>}
                    </div>
                  </div>
                ))}
                {(!selected.placement_rounds || selected.placement_rounds.length === 0) && (
                  <div className="text-center py-4 text-muted-foreground text-sm">No rounds scheduled yet.</div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Cutoff</p>
                    <p className="text-sm font-semibold">{selected.minimum_cgpa} CGPA</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Package</p>
                    <p className="text-sm font-semibold">{selected.package_max} LPA</p>
                  </div>
                </div>
                <Button className="w-full" size="lg" onClick={() => user?.id && toggleNotify({ studentId: user.id, driveId: selected.id })}>
                  {isSubscribed(selected.id) ? 'Unsubscribe from Updates' : 'Notify Me of Progress'}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PlacementJobs;
