import { Users, GraduationCap, AlertTriangle, CreditCard, Activity, Clock } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { adminStats, adminComplaints } from "@/data/mockData";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome, {user?.name}</h1>
        <p className="text-sm text-muted-foreground">NIT Durgapur Administration</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Students" value={adminStats.totalStudents.toLocaleString()} icon={Users} variant="primary" />
        <StatCard title="Total Faculty" value={adminStats.totalFaculty} icon={GraduationCap} variant="success" />
        <StatCard title="Total Staff" value={adminStats.totalStaff} icon={Users} variant="default" />
        <StatCard title="Open Complaints" value={adminStats.openComplaints} icon={AlertTriangle} variant="danger" />
        <StatCard title="Pending Fees" value={`₹${(adminStats.pendingFees / 100000).toFixed(1)}L`} icon={CreditCard} variant="warning" />
        <StatCard title="System Uptime" value={adminStats.systemUptime} icon={Activity} variant="success" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-status-danger" /> Recent Complaints</h2>
          <div className="space-y-3">
            {adminComplaints.slice(0, 3).map((c) => (
              <div key={c.id} className="rounded-lg bg-muted/30 border border-border p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-primary">{c.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === "resolved" ? "bg-status-success/10 text-status-success" : c.status === "under_review" ? "bg-status-warning/10 text-status-warning" : "bg-muted text-muted-foreground"}`}>
                    {c.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm text-foreground">{c.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.from} · {c.category} · {c.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add User", icon: Users }, { label: "View Complaints", icon: AlertTriangle },
              { label: "Generate Report", icon: Activity }, { label: "Fee Summary", icon: CreditCard },
            ].map((action) => (
              <button key={action.label} className="flex items-center gap-2 rounded-lg bg-muted/30 p-3 text-sm text-foreground hover:bg-muted/50 transition-colors">
                <action.icon className="h-4 w-4 text-primary" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
