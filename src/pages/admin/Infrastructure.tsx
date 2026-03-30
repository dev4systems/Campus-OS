import { campusBuildings } from "@/data/mockData";
import { Building2, MapPin, Layers, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Infrastructure = () => {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campus Infrastructure</h1>
          <p className="text-sm text-muted-foreground">{campusBuildings.length} buildings managed</p>
        </div>
        <Button size="sm"><Plus className="h-5 w-5 mr-1" /> Add Building</Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {campusBuildings.map((b, i) => (
          <div key={b.id} className="scroll-reveal rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors" style={{ transitionDelay: `${i * 70}ms` }}>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{b.name}</h3>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                  <span className="font-mono">{b.code}</span>
                  <span className="flex items-center gap-0.5"><Layers className="h-4 w-4" /> {b.floors} floors</span>
                  <span>{b.rooms.length} rooms</span>
                  <span className="flex items-center gap-0.5"><MapPin className="h-4 w-4" /> {b.lat.toFixed(4)}, {b.lng.toFixed(4)}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {b.rooms.slice(0, 4).map((r) => <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{r}</span>)}
                  {b.rooms.length > 4 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">+{b.rooms.length - 4}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Infrastructure;
