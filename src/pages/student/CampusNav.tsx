import { campusBuildings } from "@/data/mockData";
import { useState } from "react";
import { Search, MapPin, Building2, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import CampusImage from "@/components/CampusImage";

const CampusNav = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const filtered = query
    ? campusBuildings.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()) || b.code.toLowerCase().includes(query.toLowerCase()))
    : campusBuildings;

  const selectedBuilding = campusBuildings.find((b) => b.id === selected);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Campus Gate Hero */}
      <CampusImage
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/NIT_Durgapur_Main_Gate.jpg/1280px-NIT_Durgapur_Main_Gate.jpg"
        alt="NIT Durgapur Main Gate"
        className="h-48 rounded-xl"
      />
      <div>
        <h1 className="text-2xl font-bold text-foreground">Campus Navigation</h1>
        <p className="text-sm text-muted-foreground">Find buildings, rooms & get GPS directions</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search buildings or rooms..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10 bg-muted/50" />
      </div>

      {selectedBuilding ? (
        <div className="space-y-4">
          <button onClick={() => setSelected(null)} className="text-sm text-primary hover:underline">← All Buildings</button>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-lg font-bold text-foreground">{selectedBuilding.name}</h2>
                <p className="text-xs text-muted-foreground">{selectedBuilding.code} · {selectedBuilding.floors} Floors</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rooms</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {selectedBuilding.rooms.map((room) => (
                  <div key={room} className="flex items-center gap-2 rounded-lg bg-card border border-border p-2.5">
                    <MapPin className="h-3 w-3 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{room}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <MapPin className="h-4 w-4" /> Get GPS Directions
            </button>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((building) => (
            <button key={building.id} onClick={() => setSelected(building.id)} className="rounded-xl border border-border bg-card p-4 text-left hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{building.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{building.code}</span>
                    <span className="flex items-center gap-0.5"><Layers className="h-3 w-3" /> {building.floors}F</span>
                    <span>{building.rooms.length} rooms</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampusNav;
