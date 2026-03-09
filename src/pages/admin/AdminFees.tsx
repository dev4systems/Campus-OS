import { feesData } from "@/data/mockData";
import { CreditCard, Send, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminFees = () => {
  const { toast } = useToast();
  const totalDue = 12500000;
  const totalCollected = 11250000;
  const collectionRate = Math.round((totalCollected / totalDue) * 100);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fee Management</h1>
        <p className="text-sm text-muted-foreground">Institution-wide fee collection dashboard</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-lg font-bold text-foreground">₹{(totalDue / 100000).toFixed(1)}L</p>
          <p className="text-xs text-muted-foreground">Total Due</p>
        </div>
        <div className="rounded-xl border border-status-success/20 bg-status-success/5 p-4 text-center">
          <p className="text-lg font-bold text-status-success">₹{(totalCollected / 100000).toFixed(1)}L</p>
          <p className="text-xs text-muted-foreground">Collected</p>
        </div>
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
          <p className="text-lg font-bold text-primary">{collectionRate}%</p>
          <p className="text-xs text-muted-foreground">Collection Rate</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Students with Pending Fees</h2>
        <div className="space-y-2">
          {[
            { name: "Arjun Sharma", rollNo: "21CS8042", pending: 7500, dept: "CSE" },
            { name: "Deepak Sharma", rollNo: "21ME4015", pending: 25000, dept: "ME" },
            { name: "Sneha Roy", rollNo: "21EE3022", pending: 18000, dept: "EE" },
          ].map((s) => (
            <div key={s.rollNo} className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.rollNo} · {s.dept}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-status-danger">₹{s.pending.toLocaleString()}</span>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => toast({ title: "Reminder sent" })}><Send className="h-3 w-3 mr-1" /> Remind</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button variant="outline"><Download className="h-4 w-4 mr-1" /> Export Report</Button>
    </div>
  );
};

export default AdminFees;
