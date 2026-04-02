import { Briefcase } from "lucide-react";

const AppliedJobs = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold flex items-center gap-2">
      <Briefcase className="h-6 w-6" style={{ color: "hsl(var(--primary))" }} />
      Applied Jobs
    </h1>
    <div className="text-center py-16 text-muted-foreground">
      <Briefcase className="mx-auto h-12 w-12 mb-3 opacity-40" />
      <p>Your applied jobs will appear here.</p>
    </div>
  </div>
);

export default AppliedJobs;
