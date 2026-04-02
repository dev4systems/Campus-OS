import { Briefcase, CheckCircle2 } from "lucide-react";

const EligibleJobs = () => {
  return (
    <div className="space-y-6">
      <div className="scroll-reveal">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="h-6 w-6" style={{ color: "hsl(var(--primary))" }} />
          Eligible Jobs
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Jobs matching your profile criteria</p>
      </div>
      <div className="scroll-reveal text-center py-16 text-muted-foreground" style={{ transitionDelay: "70ms" }}>
        <CheckCircle2 className="mx-auto h-12 w-12 mb-3 opacity-40" />
        <p className="font-medium">Eligible jobs will appear here</p>
        <p className="text-xs mt-1">Based on your CGPA, branch, and backlog status</p>
      </div>
    </div>
  );
};

export default EligibleJobs;
