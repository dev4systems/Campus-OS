import { useState } from "react";
import { Search, UserPlus, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const users = [
  { id: "STU001", name: "Arjun Sharma", email: "arjun@nitdgp.ac.in", role: "Student", status: "active", dept: "CSE" },
  { id: "STU002", name: "Priya Sharma", email: "priya@nitdgp.ac.in", role: "Student", status: "active", dept: "CSE" },
  { id: "STU003", name: "Rahul Kumar", email: "rahul@nitdgp.ac.in", role: "Student", status: "active", dept: "ECE" },
  { id: "FAC001", name: "Prof. Rajesh Verma", email: "prof.verma@nitdgp.ac.in", role: "Teacher", status: "active", dept: "CSE" },
  { id: "FAC002", name: "Dr. S. Mukherjee", email: "s.mukherjee@nitdgp.ac.in", role: "Teacher", status: "active", dept: "CSE" },
  { id: "ADM001", name: "Dr. Anita Roy", email: "admin@nitdgp.ac.in", role: "Admin", status: "active", dept: "Admin" },
  { id: "STU004", name: "Deepak Sharma", email: "deepak@nitdgp.ac.in", role: "Student", status: "inactive", dept: "ME" },
];

const UserManagement = () => {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const filtered = users.filter((u) =>
    (roleFilter === "all" || u.role.toLowerCase() === roleFilter) &&
    (u.name.toLowerCase().includes(query.toLowerCase()) || u.email.includes(query.toLowerCase()) || u.id.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground">{users.length} users in system</p>
        </div>
        <Button size="sm"><UserPlus className="h-5 w-5 mr-1" /> Add User</Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10 bg-muted/50" />
        </div>
        <Select onValueChange={setRoleFilter} defaultValue="all">
          <SelectTrigger className="w-[140px] bg-muted/50"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Roles</SelectItem><SelectItem value="student">Students</SelectItem><SelectItem value="teacher">Teachers</SelectItem><SelectItem value="admin">Admins</SelectItem></SelectContent>
        </Select>
      </div>

      <div className="scroll-reveal rounded-xl border border-border bg-card overflow-hidden">
        <div className="divide-y divide-border">
          {filtered.map((u) => (
            <div key={u.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                <div>
                  <p className="text-sm font-medium text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email} · {u.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">{u.role}</Badge>
                <Badge className={u.status === "active" ? "bg-status-success/10 text-status-success border-status-success/20" : "bg-muted text-muted-foreground"}>{u.status}</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8" data-tooltip="More options"><MoreHorizontal className="h-5 w-5" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
