import { useAnalytics, usePageView } from "@/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, Activity, GraduationCap, Briefcase, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToCSV } from "@/lib/export";

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7'];

export default function AnalyticsDashboard() {
  usePageView('Admin Analytics');
  const { dau, featureUsage, attendanceHealth, placementFunnel } = useAnalytics();

  const isLoading = dau.isLoading || featureUsage.isLoading || attendanceHealth.isLoading || placementFunnel.isLoading;

  const handleExport = () => {
    if (featureUsage.data) {
      exportToCSV(featureUsage.data, "Nexus_Feature_Usage");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform-wide usage and health metrics</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/10 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
              <Users className="h-3.5 w-3.5" /> 30D Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-primary">{dau.data?.reduce((acc: any, curr: any) => acc + curr.count, 0) || 0}</div>
          </CardContent>
        </Card>
        {/* Add more KPI cards if needed */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DAU Line Chart */}
        <Card className="rounded-2xl border border-border shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" /> Daily Active Users
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dau.data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" fontSize={10} tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} />
                <YAxis fontSize={10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
                />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Feature Usage Bar Chart */}
        <Card className="rounded-2xl border border-border shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" /> Feature Engagement
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureUsage.data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="feature" fontSize={10} interval={0} />
                <YAxis fontSize={10} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                <Bar dataKey="count" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Health Pie Chart */}
        <Card className="rounded-2xl border border-border shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-green-500" /> Student Attendance Health
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceHealth.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="student_count"
                  nameKey="health_status"
                >
                  {attendanceHealth.data?.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Placement Funnel Chart */}
        <Card className="rounded-2xl border border-border shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-orange-500" /> Placement Funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={placementFunnel.data} margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="round_name" type="category" fontSize={10} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
