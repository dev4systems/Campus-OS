import { useDirections } from "@/contexts/DirectionsContext";
import { useNavigate } from "react-router-dom";
import { X, RotateCcw, Minus, MapPin, Loader2, AlertTriangle } from "lucide-react";

const FloatingDirectionsPanel = () => {
  const { status, destination, distanceKm, etaMin, errorMsg, minimized, farFromCampus, requestDirections, clearDirections, toggleMinimized } = useDirections();
  const navigate = useNavigate();

  if (status === "idle") return null;

  /* ── Minimized pill ───────────────────────── */
  if (status === "active" && minimized) {
    return (
      <button
        onClick={toggleMinimized}
        className="fixed bottom-4 right-4 z-[9999] px-4 h-12 rounded-full bg-primary text-primary-foreground font-medium text-sm shadow-lg flex items-center gap-2 animate-[slideUp_250ms_ease_both]"
      >
        🚶 {etaMin}min
      </button>
    );
  }

  /* ── Shared bar wrapper ───────────────────── */
  const isLoading = status === "locating" || status === "routing";
  const isError = status === "error";
  const isActive = status === "active";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] animate-[slideUp_250ms_ease_both]"
      style={{ "--tw-backdrop-blur": "blur(12px)" } as React.CSSProperties}
    >
      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-between px-4 h-[52px] bg-card/95 backdrop-blur-md border-t border-border">
          <span className="flex items-center gap-2 text-sm text-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            {status === "locating" ? "Getting your location..." : "Calculating route..."}
          </span>
          <button onClick={clearDirections} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-center justify-between px-4 h-[52px] bg-status-danger/10 backdrop-blur-md border-t border-status-danger/30">
          <span className="flex items-center gap-2 text-sm text-foreground">
            <AlertTriangle className="h-4 w-4 text-status-danger" />
            {errorMsg}
          </span>
          <div className="flex items-center gap-1">
            {destination && (
              <button onClick={() => requestDirections(destination)} className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 flex items-center gap-1">
                <RotateCcw className="h-3 w-3" /> Retry
              </button>
            )}
            <button onClick={clearDirections} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground"><X className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {/* Active expanded */}
      {isActive && !minimized && (
        <div className="bg-card/95 backdrop-blur-md border-t border-border px-4 py-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">🚶 {destination?.name}</span>
            <div className="flex items-center gap-1">
              <button onClick={toggleMinimized} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground"><Minus className="h-4 w-4" /></button>
              <button onClick={clearDirections} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground"><X className="h-4 w-4" /></button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{distanceKm} km • ~{etaMin} min walk</p>
          {farFromCampus && <p className="text-xs text-status-warning">⚠ You appear to be far from campus</p>}
          <button
            onClick={() => navigate("/student/campus-nav")}
            className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20"
          >
            <MapPin className="h-3.5 w-3.5" /> Open Map
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingDirectionsPanel;
