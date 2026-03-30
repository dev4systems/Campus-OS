import { Key, Shield, Clock } from "lucide-react";

const auditLog = [
  { action: "Password Reset", user: "admin@nitdgp.ac.in", target: "arjun@nitdgp.ac.in", time: "2026-03-09 14:32", ip: "10.0.1.52" },
  { action: "User Deactivated", user: "admin@nitdgp.ac.in", target: "deepak@nitdgp.ac.in", time: "2026-03-08 10:15", ip: "10.0.1.52" },
  { action: "Login", user: "prof.verma@nitdgp.ac.in", target: "—", time: "2026-03-09 09:00", ip: "10.0.2.18" },
  { action: "Role Changed", user: "admin@nitdgp.ac.in", target: "new.faculty@nitdgp.ac.in", time: "2026-03-07 16:45", ip: "10.0.1.52" },
];

const Credentials = () => {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Access Control & Security</h1>
        <p className="text-sm text-muted-foreground">Password management, audit logs & security</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="scroll-reveal rounded-xl border border-status-success/20 bg-status-success/5 p-4 flex items-center gap-3">
          <Shield className="h-6 w-6 text-status-success" />
          <div>
            <p className="text-sm font-bold text-foreground">Secure</p>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </div>
        </div>
        <div className="scroll-reveal rounded-xl border border-border bg-card p-4 flex items-center gap-3" style={{ transitionDelay: "70ms" }}>
          <Clock className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-bold text-foreground">Last Backup</p>
            <p className="text-xs text-muted-foreground">Today, 03:00 AM</p>
          </div>
        </div>
        <div className="scroll-reveal rounded-xl border border-border bg-card p-4 flex items-center gap-3" style={{ transitionDelay: "140ms" }}>
          <Key className="h-6 w-6 text-nexus-amber" />
          <div>
            <p className="text-sm font-bold text-foreground">Encryption</p>
            <p className="text-xs text-muted-foreground">AES-256 Active</p>
          </div>
        </div>
      </div>

      <div className="scroll-reveal rounded-xl border border-border bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Audit Log</h2>
        </div>
        <div className="divide-y divide-border">
          {auditLog.map((log, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{log.action}</p>
                <p className="text-xs text-muted-foreground">By: {log.user} → {log.target}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{log.time}</p>
                <p className="text-xs text-muted-foreground font-mono">{log.ip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Credentials;
