import { useAuth } from "@/contexts/AuthContext";
import { useProfessorRequests, useUpdateRequestStatus } from "@/hooks/useResearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Mail, MessageSquare, Clock, User } from "lucide-react";

export default function ResearchRequests() {
  const { user } = useAuth();
  const { data: requests = [], isLoading } = useProfessorRequests(user?.email);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateRequestStatus();

  const handleStatusUpdate = (id: string, status: 'accepted' | 'rejected') => {
    updateStatus({ id, status }, {
      onSuccess: () => toast.success(`Request ${status} successfully`),
      onError: (err: any) => toast.error(`Error: ${err.message}`)
    });
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-full"/><Skeleton className="h-64 w-full"/></div>;

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const pastRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Collaboration Requests</h1>
        <p className="text-sm text-muted-foreground">Manage student interests in your research projects</p>
      </div>

      <div className="grid gap-6">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Pending Actions ({pendingRequests.length})
          </h2>
          
          <div className="grid gap-4">
            {pendingRequests.map((req) => (
              <Card key={req.id} className="border-primary/20 shadow-sm overflow-hidden">
                <CardHeader className="bg-primary/5 pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {req.profiles?.full_name}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {req.profiles?.email}</span>
                        <span className="font-medium text-primary">Project: {req.research_projects?.title}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-background">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap italic">
                      <MessageSquare className="h-3.5 w-3.5 inline mr-2 text-muted-foreground" />
                      "{req.message}"
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleStatusUpdate(req.id, 'rejected')}
                      disabled={isUpdating}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> Decline
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusUpdate(req.id, 'accepted')}
                      disabled={isUpdating}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Accept Collaboration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pendingRequests.length === 0 && (
              <div className="py-12 text-center border-2 border-dashed border-border rounded-xl text-muted-foreground">
                No new collaboration requests.
              </div>
            )}
          </div>
        </section>

        {pastRequests.length > 0 && (
          <section className="space-y-4 opacity-80">
            <h2 className="text-lg font-semibold">History</h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pastRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{req.profiles?.full_name}</td>
                      <td className="px-4 py-3 max-w-[200px] truncate">{req.research_projects?.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(req.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant={req.status === 'accepted' ? 'default' : 'secondary'} className={req.status === 'accepted' ? 'bg-green-500' : ''}>
                          {req.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
