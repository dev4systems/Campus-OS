import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MARKERS = [
  { name: "Main Gate", lat: 23.5412, lng: 87.2921, desc: "Primary entrance to NIT Durgapur campus" },
  { name: "Academic Block", lat: 23.5431, lng: 87.2945, desc: "Central academic & lecture hall complex" },
  { name: "Library", lat: 23.5438, lng: 87.2934, desc: "Central Library — books, journals & e-resources" },
  { name: "Hostel Zone", lat: 23.5418, lng: 87.2908, desc: "Student residential hostels area" },
  { name: "Canteen", lat: 23.5425, lng: 87.2951, desc: "Main campus food court & canteen" },
  { name: "Admin Block", lat: 23.5442, lng: 87.2928, desc: "Administrative offices" },
  { name: "Sports Complex", lat: 23.5405, lng: 87.2962, desc: "Indoor & outdoor sports facilities" },
];

function getDirections(lat: number, lng: number, name: string) {
  const fallbackUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=18`;

  if (!navigator.geolocation) {
    window.open(fallbackUrl, "_blank");
    return;
  }

  const timeout = setTimeout(() => {
    window.open(fallbackUrl, "_blank");
  }, 5000);

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      clearTimeout(timeout);
      const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${pos.coords.latitude},${pos.coords.longitude};${lat},${lng}`;
      window.open(url, "_blank");
    },
    () => {
      clearTimeout(timeout);
      window.open(fallbackUrl, "_blank");
    },
    { enableHighAccuracy: true, timeout: 5000 }
  );
}

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
          `<div style="font-family:Inter,system-ui,sans-serif">
            <strong style="font-size:14px">${m.name}</strong>
            <p style="margin:4px 0 8px;font-size:12px;color:#666">${m.desc}</p>
            <button onclick="window.__getDirections(${m.lat},${m.lng},'${m.name}')" style="display:inline-flex;align-items:center;gap:4px;padding:6px 12px;border-radius:8px;background:hsl(210,100%,52%);color:#fff;border:none;font-size:12px;font-weight:500;cursor:pointer">
              📍 Get Directions
            </button>
          </div>`,
          { className: "leaflet-popup-themed" }
        );
    });

    // Expose directions helper for popup buttons
    (window as any).__getDirections = getDirections;

    if (window.innerWidth < 768) {
      map.on("click", () => map.scrollWheelZoom.enable());
      map.on("mouseout", () => map.scrollWheelZoom.disable());
    }

    mapInstance.current = map;
    setReady(true);

    return () => {
      map.remove();
      mapInstance.current = null;
      delete (window as any).__getDirections;
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
