import { createContext, useContext, useState, useCallback, ReactNode } from "react";

/* ── Haversine ──────────────────────────────────── */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ── Types ──────────────────────────────────────── */
type Status = "idle" | "locating" | "routing" | "active" | "error";

interface Destination { name: string; lat: number; lng: number }

interface DirectionsState {
  active: boolean;
  destination: Destination | null;
  distanceKm: number | null;
  etaMin: number | null;
  status: Status;
  errorMsg: string | null;
  minimized: boolean;
  farFromCampus: boolean;
}

interface DirectionsContextValue extends DirectionsState {
  requestDirections: (dest: Destination) => void;
  clearDirections: () => void;
  toggleMinimized: () => void;
}

const initial: DirectionsState = {
  active: false, destination: null, distanceKm: null, etaMin: null,
  status: "idle", errorMsg: null, minimized: false, farFromCampus: false,
};

const Ctx = createContext<DirectionsContextValue | null>(null);

export function useDirections() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useDirections must be inside DirectionsProvider");
  return c;
}

export function DirectionsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DirectionsState>(initial);

  const clearDirections = useCallback(() => setState(initial), []);
  const toggleMinimized = useCallback(() => setState(s => ({ ...s, minimized: !s.minimized })), []);

  const requestDirections = useCallback((dest: Destination) => {
    setState(s => ({ ...s, destination: dest, status: "locating", errorMsg: null, active: true, minimized: false, farFromCampus: false }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        const far = haversineKm(uLat, uLng, dest.lat, dest.lng) > 100;

        setState(s => ({ ...s, status: "routing", farFromCampus: far }));

        fetch(`https://router.project-osrm.org/route/v1/walking/${uLng},${uLat};${dest.lng},${dest.lat}?overview=false`)
          .then(r => r.json())
          .then(data => {
            if (data.code !== "Ok" || !data.routes?.length) {
              setState(s => ({ ...s, status: "error", errorMsg: "Could not calculate route." }));
              return;
            }
            const route = data.routes[0];
            setState(s => ({
              ...s,
              status: "active",
              distanceKm: Math.round((route.distance / 1000) * 10) / 10,
              etaMin: Math.round(route.duration / 60),
            }));
          })
          .catch(() => setState(s => ({ ...s, status: "error", errorMsg: "Could not calculate route." })));
      },
      (err) => {
        const msgs: Record<number, string> = {
          1: "Location access denied. Enable GPS in browser settings.",
          2: "Location unavailable.",
          3: "Request timed out. Try again.",
        };
        setState(s => ({ ...s, status: "error", errorMsg: msgs[err.code] || "Location error." }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }, []);

  return (
    <Ctx.Provider value={{ ...state, requestDirections, clearDirections, toggleMinimized }}>
      {children}
    </Ctx.Provider>
  );
}
