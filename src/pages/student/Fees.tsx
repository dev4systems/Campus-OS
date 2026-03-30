import { feesData } from "@/data/mockData";
import { CheckCircle2, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Fees = () => {
  const totalDue = feesData.reduce((s, f) => s + f.amount, 0);
  const totalPaid = feesData.reduce((s, f) => s + f.paid, 0);
  const totalPending = totalDue - totalPaid;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fees</h1>
        <p className="text-sm text-muted-foreground">Payment status and history</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="scroll-reveal rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground">Total Due</p>
          <p className="text-xl font-bold text-foreground">₹{totalDue.toLocaleString()}</p>
        </div>
        <div className="scroll-reveal rounded-xl border border-status-success/20 bg-status-success/5 p-4 text-center" style={{ transitionDelay: "70ms" }}>
          <p className="text-xs text-muted-foreground">Paid</p>
          <p className="text-xl font-bold text-status-success">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="scroll-reveal rounded-xl border border-status-danger/20 bg-status-danger/5 p-4 text-center" style={{ transitionDelay: "140ms" }}>
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="text-xl font-bold text-status-danger">₹{totalPending.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-3">
        {feesData.map((fee, i) => (
          <div key={i} className={`scroll-reveal rounded-xl border p-4 flex items-center justify-between ${fee.status === "paid" ? "border-status-success/20 bg-status-success/5" : "border-status-danger/20 bg-status-danger/5"}`} style={{ transitionDelay: `${i * 70}ms` }}>
            <div className="flex items-center gap-3">
              {fee.status === "paid" ? <CheckCircle2 className="h-5 w-5 text-status-success" /> : <Clock className="h-5 w-5 text-status-danger" />}
              <div>
                <p className="font-medium text-foreground">{fee.type}</p>
                <p className="text-xs text-muted-foreground">Due: {fee.dueDate} {fee.txnId && `· ${fee.txnId}`}</p>
              </div>
            </div>
            <div className="text-right flex items-center gap-3">
              <p className="font-bold text-foreground">₹{fee.amount.toLocaleString()}</p>
              {fee.status === "paid" ? (
                <Button variant="outline" size="sm" className="text-xs"><Download className="h-4 w-4 mr-1" /> Receipt</Button>
              ) : (
                <Button size="sm" className="text-xs">Pay Now</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fees;
