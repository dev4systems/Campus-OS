import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

const EmptyState = ({ icon: Icon, title, subtitle }: EmptyStateProps) => (
  <div className="rounded-xl border border-border bg-card p-10 flex flex-col items-center justify-center text-center space-y-3">
    <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
      <Icon className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="text-base font-bold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-xs">{subtitle}</p>
  </div>
);

export default EmptyState;
