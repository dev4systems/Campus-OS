import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { FileQuestion, ChevronLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const dashboardPath = user ? `/${user.portal}` : "/";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <FileQuestion className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">404</h1>
      <p className="mt-4 text-lg font-medium text-muted-foreground">This page doesn't exist on the Nexus portal.</p>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        We couldn't find the page you're looking for. It might have been moved or doesn't exist yet.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button asChild variant="default" size="lg">
          <Link to={dashboardPath}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <p className="mt-8 text-xs text-muted-foreground">
        Path: <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{location.pathname}</span>
      </p>
    </div>
  );
};

export default NotFound;
