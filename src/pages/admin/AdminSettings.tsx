import { Globe, Calendar, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
        <p className="text-sm text-muted-foreground">Configure institution and system preferences</p>
      </div>

      <div className="space-y-6">
        <div className="scroll-reveal rounded-xl border border-border bg-card p-5 space-y-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Institution Info</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Institution Name</label>
              <Input defaultValue="National Institute of Technology Durgapur" className="bg-muted/30" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Website</label>
              <Input defaultValue="nitdgp.ac.in" className="bg-muted/30" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Contact Email</label>
              <Input defaultValue="info@nitdgp.ac.in" className="bg-muted/30" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Location</label>
              <Input defaultValue="Durgapur, West Bengal 713209" className="bg-muted/30" />
            </div>
          </div>
        </div>

        <div className="scroll-reveal rounded-xl border border-border bg-card p-5 space-y-4" style={{ transitionDelay: "70ms" }}>
          <h2 className="font-semibold text-foreground flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Academic Settings</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Semester Start</label>
              <Input type="date" defaultValue="2026-01-06" className="bg-muted/30" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Semester End</label>
              <Input type="date" defaultValue="2026-05-30" className="bg-muted/30" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Grading Scale</label>
              <Input defaultValue="10-point CGPA" className="bg-muted/30" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Min Attendance %</label>
              <Input type="number" defaultValue="75" className="bg-muted/30" />
            </div>
          </div>
        </div>

        <div className="scroll-reveal rounded-xl border border-border bg-card p-5 space-y-4" style={{ transitionDelay: "140ms" }}>
          <h2 className="font-semibold text-foreground flex items-center gap-2"><Shield className="h-5 w-5 text-[#8b5cf6]" /> System Configuration</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Backup Frequency</label>
              <Input defaultValue="Daily at 3:00 AM" className="bg-muted/30" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Session Timeout</label>
              <Input defaultValue="30 minutes" className="bg-muted/30" />
            </div>
          </div>
        </div>

        <Button onClick={() => toast({ title: "Settings Saved" })}>Save Changes</Button>
      </div>
    </div>
  );
};

export default AdminSettings;
