import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MARKERS = [
  { name: "Main Gate", lat: 23.5472, lng: 87.2955, desc: "Primary entrance to NIT Durgapur campus" },
  { name: "Academic Block", lat: 23.5430, lng: 87.2940, desc: "Central academic & lecture hall complex" },
  { name: "Library", lat: 23.5418, lng: 87.2925, desc: "Central Library — books, journals & e-resources" },
  { name: "Hostel Zone", lat: 23.5400, lng: 87.2910, desc: "Student residential hostels area" },
  { name: "Canteen", lat: 23.5425, lng: 87.2960, desc: "Main campus food court & canteen" },
];

function createCircleIcon() {
  return L.divIcon({
    className: "",
    html: `<svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="10" fill="hsl(210,100%,52%)" stroke="white" stroke-width="3"/></svg>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

const CampusMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [23.5423, 87.2932],
      zoom: 16,
      scrollWheelZoom: window.innerWidth >= 768,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const icon = createCircleIcon();

    MARKERS.forEach((m) => {
      L.marker([m.lat, m.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:Inter,system-ui,sans-serif"><strong style="font-size:14px">${m.name}</strong><p style="margin:4px 0 0;font-size:12px;color:#666">${m.desc}</p></div>`,
          { className: "leaflet-popup-themed" }
        );
    });

    // Mobile: enable scroll zoom on click
    if (window.innerWidth < 768) {
      map.on("click", () => map.scrollWheelZoom.enable());
      map.on("mouseout", () => map.scrollWheelZoom.disable());
    }

    mapInstance.current = map;
    setReady(true);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div
      className="overflow-hidden rounded-2xl border border-border"
      style={{
        height: 420,
        opacity: ready ? 1 : 0,
        transition: "opacity 400ms ease-out",
      }}
    >
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
};

export default CampusMap;
