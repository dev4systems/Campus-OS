import { useEffect, useRef, useState, useCallback } from "react";
import * as L from "leaflet";
import { Search, MapPin, Navigation, X, AlertTriangle } from "lucide-react";

// ── DATA ────────────────────────────────────────────────────────────────────
const CAMPUS_LOCATIONS = [
  { id: "main-gate", name: "Main Gate", short: "Main Gate", category: "landmark", lat: 23.5468, lng: 87.2891, description: "Primary entrance to NIT Durgapur campus facing Mahatma Gandhi Road (NH-19)" },
  { id: "mab", name: "Main Academic Building (MAB)", short: "MAB", category: "academic", lat: 23.5432, lng: 87.2935, description: "Primary academic building — houses most undergraduate classrooms. Approx 82 classrooms total across MAB & NAB." },
  { id: "nab", name: "New Academic Building (NAB)", short: "NAB", category: "academic", lat: 23.5435, lng: 87.2940, description: "New Academic Building — fully air-conditioned classrooms, seating capacity ~250 per room." },
  { id: "utkarsh", name: "Utkarsh Bhawan (Research Building)", short: "Utkarsh", category: "academic", lat: 23.5440, lng: 87.2945, description: "G+10 storied Central Research & Academic Laboratory Building. Houses advanced research labs and PhD facilities." },
  { id: "mab-101", name: "MAB-101", short: "MAB-101", category: "classroom", lat: 23.5431, lng: 87.2933, description: "Classroom — MAB Ground Floor, Wing A. Capacity ~80." },
  { id: "mab-102", name: "MAB-102", short: "MAB-102", category: "classroom", lat: 23.5431, lng: 87.2936, description: "Classroom — MAB Ground Floor, Wing A. Capacity ~80." },
  { id: "mab-103", name: "MAB-103", short: "MAB-103", category: "classroom", lat: 23.5431, lng: 87.2938, description: "Classroom — MAB Ground Floor, Wing B. Capacity ~60." },
  { id: "mab-201", name: "MAB-201", short: "MAB-201", category: "classroom", lat: 23.5433, lng: 87.2933, description: "Classroom — MAB First Floor, Wing A. Capacity ~80." },
  { id: "mab-202", name: "MAB-202", short: "MAB-202", category: "classroom", lat: 23.5433, lng: 87.2936, description: "Classroom — MAB First Floor, Wing A. Capacity ~80." },
  { id: "mab-203", name: "MAB-203", short: "MAB-203", category: "classroom", lat: 23.5433, lng: 87.2938, description: "Classroom — MAB First Floor, Wing B. Capacity ~60." },
  { id: "mab-301", name: "MAB-301", short: "MAB-301", category: "classroom", lat: 23.5434, lng: 87.2933, description: "Classroom — MAB Second Floor. Capacity ~80." },
  { id: "nab-101", name: "NAB-101", short: "NAB-101", category: "classroom", lat: 23.5435, lng: 87.2938, description: "Air-conditioned classroom — NAB Ground Floor. Capacity ~250." },
  { id: "nab-102", name: "NAB-102", short: "NAB-102", category: "classroom", lat: 23.5435, lng: 87.2941, description: "Air-conditioned classroom — NAB Ground Floor. Capacity ~250." },
  { id: "nab-201", name: "NAB-201", short: "NAB-201", category: "classroom", lat: 23.5436, lng: 87.2938, description: "Air-conditioned classroom — NAB First Floor. Capacity ~250." },
  { id: "nab-202", name: "NAB-202", short: "NAB-202", category: "classroom", lat: 23.5436, lng: 87.2941, description: "Air-conditioned classroom — NAB First Floor. Capacity ~250." },
  { id: "cse-dept", name: "CSE Department", short: "CSE", category: "department", lat: 23.5428, lng: 87.2948, description: "Department of Computer Science & Engineering. Houses faculty offices, CSE labs, seminar hall." },
  { id: "ece-dept", name: "ECE Department", short: "ECE", category: "department", lat: 23.5422, lng: 87.2942, description: "Department of Electronics & Communication Engineering. VLSI Lab, 5G Lab, Nano Device Lab." },
  { id: "ee-dept", name: "EE Department", short: "EE", category: "department", lat: 23.5419, lng: 87.2938, description: "Department of Electrical Engineering. High Voltage Laboratory, Power Systems Lab." },
  { id: "me-dept", name: "ME Department", short: "ME", category: "department", lat: 23.5416, lng: 87.2945, description: "Department of Mechanical Engineering. Workshop, Manufacturing Lab, Robotics Lab." },
  { id: "civil-dept", name: "Civil Engineering Department", short: "Civil", category: "department", lat: 23.5413, lng: 87.2940, description: "Department of Civil Engineering. Structural Lab, Transportation Lab, Environmental Lab." },
  { id: "che-dept", name: "Chemical Engineering Department", short: "ChE", category: "department", lat: 23.5410, lng: 87.2943, description: "Department of Chemical Engineering." },
  { id: "mme-dept", name: "Metallurgical & Materials Engineering Department", short: "MME", category: "department", lat: 23.5411, lng: 87.2947, description: "Department of Metallurgical & Materials Engineering." },
  { id: "bt-dept", name: "Biotechnology Department", short: "BT", category: "department", lat: 23.5414, lng: 87.2950, description: "Department of Biotechnology." },
  { id: "computer-centre", name: "Computer Centre", short: "CC", category: "lab", lat: 23.5430, lng: 87.2955, description: "Central computing facility — GPU servers, air-conditioned labs, 400 kVA DG Set backup. Open to all students." },
  { id: "high-voltage-lab", name: "High Voltage Laboratory", short: "HV Lab", category: "lab", lat: 23.5418, lng: 87.2935, description: "Graduate research & undergraduate teaching lab — one of few such facilities in India. Under EE Department." },
  { id: "cse-lab-1", name: "CSE Lab 1 (Programming Lab)", short: "CS Lab 1", category: "lab", lat: 23.5427, lng: 87.2946, description: "General purpose computing lab — 60 systems. Used for programming courses." },
  { id: "cse-lab-2", name: "CSE Lab 2 (Networking Lab)", short: "CS Lab 2", category: "lab", lat: 23.5427, lng: 87.2950, description: "Networking & OS lab — 40 systems. Advanced Software Engineering & Networking Lab." },
  { id: "vlsi-lab", name: "VLSI Laboratory", short: "VLSI Lab", category: "lab", lat: 23.5426, lng: 87.2952, description: "VLSI Design & Testing lab — ECE Department 2nd floor. SMDP-supported facility." },
  { id: "5g-lab", name: "5G Research Lab", short: "5G Lab", category: "lab", lat: 23.5423, lng: 87.2944, description: "5G & wireless communication research lab — ECE Department." },
  { id: "ceam", name: "Centre of Excellence in Advanced Materials", short: "CEAM", category: "lab", lat: 23.5441, lng: 87.2948, description: "Research centre for advanced materials science — in Utkarsh Bhawan complex." },
  { id: "beat", name: "Centre for Biomedical Engineering & Assistive Technology (BEAT)", short: "BEAT", category: "lab", lat: 23.5442, lng: 87.2950, description: "Interdisciplinary biomedical engineering and assistive technology research centre." },
  { id: "iotis", name: "Centre of Excellence on IoT & Intelligent Systems (IoTIS)", short: "IoTIS", category: "lab", lat: 23.5439, lng: 87.2949, description: "Research centre for IoT and AI/ML-based intelligent systems." },
  { id: "central-library", name: "Central Library", short: "Library", category: "facility", lat: 23.5442, lng: 87.2930, description: "3-floor library — 1.2 lakh+ volumes, 800+ online journals, Wi-Fi, Xerox. Open 24×7 during exams. LIBSYS-4 automated." },
  { id: "admin-block", name: "Administrative Block", short: "Admin", category: "academic", lat: 23.5445, lng: 87.2920, description: "Director's office, Registrar, Dean offices, Academic section, Examination section." },
  { id: "auditorium", name: "Auditorium", short: "Auditorium", category: "facility", lat: 23.5448, lng: 87.2938, description: "Main indoor auditorium — hosts Aarohan (annual techno-management fest), cultural events, seminars." },
  { id: "placement-cell", name: "Training & Placement Cell (CDC)", short: "T&P Cell", category: "facility", lat: 23.5443, lng: 87.2925, description: "Career Development Centre — placement drives, pre-placement talks, internship coordination." },
  { id: "medical-centre", name: "Medical Centre", short: "Medical", category: "facility", lat: 23.5450, lng: 87.2915, description: "Campus hospital — 3 resident doctors, 3 contractual doctors, 10 indoor beds, OPD, emergency services 24×7, pharmacy." },
  { id: "the-oval", name: "The Oval (Main Ground)", short: "The Oval", category: "facility", lat: 23.5390, lng: 87.2930, description: "Main sports ground — football, cricket, standard athletic track. Major tournaments and matches held here." },
  { id: "the-lords", name: "The Lords Ground", short: "The Lords", category: "facility", lat: 23.5395, lng: 87.2940, description: "Secondary ground adjacent to hostels — sports activities and non-sports events." },
  { id: "basketball-court", name: "Basketball Court", short: "Basketball", category: "facility", lat: 23.5397, lng: 87.2933, description: "Basketball court — open to all students." },
  { id: "tennis-court", name: "Tennis Court", short: "Tennis", category: "facility", lat: 23.5399, lng: 87.2937, description: "Tennis court — open to all students." },
  { id: "gymnasium", name: "Gymnasium", short: "Gym", category: "facility", lat: 23.5393, lng: 87.2945, description: "Campus gymnasium with all necessary machines — open to students and staff." },
  { id: "indoor-sports", name: "Indoor Sports Hall", short: "Indoor Sports", category: "facility", lat: 23.5392, lng: 87.2942, description: "Indoor sports facility — badminton, table tennis, chess." },
  { id: "sbi-branch", name: "SBI Branch & ATM", short: "SBI Bank", category: "facility", lat: 23.5462, lng: 87.2897, description: "State Bank of India campus branch with ATM. Near main gate." },
  { id: "canara-bank", name: "Canara Bank", short: "Canara Bank", category: "facility", lat: 23.5460, lng: 87.2900, description: "Canara Bank campus branch." },
  { id: "post-office", name: "Post Office", short: "Post Office", category: "facility", lat: 23.5458, lng: 87.2903, description: "Campus post office for courier and postal services." },
  { id: "shopping-complex", name: "Shopping Complex", short: "Shopping", category: "facility", lat: 23.5407, lng: 87.2958, description: "Shopping complex in the middle of the residential area — meets daily needs of students and residents." },
  { id: "guest-house", name: "Institute Guest House", short: "Guest House", category: "facility", lat: 23.5452, lng: 87.2910, description: "Double-storied guest house beside Director's Bungalow — for official guests, faculty guests, student parents." },
  { id: "canteen-mab", name: "Main Canteen (near MAB)", short: "Main Canteen", category: "food", lat: 23.5430, lng: 87.2929, description: "Primary student & staff canteen — located near the Main Academic Building. Serves breakfast, lunch, snacks, dinner." },
  { id: "canteen-rear", name: "Rear Canteen (MAB Back Gate)", short: "Rear Canteen", category: "food", lat: 23.5429, lng: 87.2923, description: "Second canteen at the rear exit of Main Academic Building." },
  { id: "wonder-cafe", name: "Wonder Cafe", short: "Wonder Cafe", category: "food", lat: 23.5435, lng: 87.2927, description: "Popular campus cafe — snacks, beverages, quick bites." },
  { id: "nescafe", name: "Nescafe", short: "Nescafe", category: "food", lat: 23.5433, lng: 87.2925, description: "Nescafe outlet on campus — coffee, tea, hot beverages." },
  { id: "chandu-tea", name: "Chandu Tea Stall", short: "Chandu's", category: "food", lat: 23.5426, lng: 87.2930, description: "Iconic campus tea stall — student favourite for chai and snacks." },
  { id: "techno-cafe", name: "Techno Cafe", short: "Techno", category: "food", lat: 23.5424, lng: 87.2927, description: "Techno campus canteen — snacks, meals, cold drinks." },
  { id: "hall-1", name: "Hall-1 — Netaji Subhas Chandra Bose Hall of Residence", short: "Hall-1 (SCB)", category: "hostel", lat: 23.5410, lng: 87.2960, description: "Boys hostel. Named after Netaji Subhas Chandra Bose. One of the older halls." },
  { id: "hall-2", name: "Hall-2 — Jagadish Chandra Bose Hall of Residence", short: "Hall-2 (JCB)", category: "hostel", lat: 23.5408, lng: 87.2964, description: "Boys hostel. Named after scientist Jagadish Chandra Bose." },
  { id: "hall-3", name: "Hall-3 — Rabindra Nath Tagore Hall of Residence", short: "Hall-3 (RNT)", category: "hostel", lat: 23.5406, lng: 87.2968, description: "Boys hostel. Named after Nobel laureate Rabindra Nath Tagore." },
  { id: "hall-4", name: "Hall-4 — C V Raman Hall of Residence", short: "Hall-4 (CVR)", category: "hostel", lat: 23.5404, lng: 87.2963, description: "Boys hostel. Named after Nobel laureate C V Raman." },
  { id: "hall-5", name: "Hall-5 — Swami Vivekananda Hall of Residence", short: "Hall-5 (SV)", category: "hostel", lat: 23.5402, lng: 87.2970, description: "Boys hostel. Named after Swami Vivekananda." },
  { id: "hall-6", name: "Hall-6 — Rishi Aurobindo Hall of Residence", short: "Hall-6 (RA)", category: "hostel", lat: 23.5400, lng: 87.2966, description: "Boys hostel. Named after philosopher Rishi Aurobindo." },
  { id: "hall-9", name: "Hall-9 — Satyendra Nath Bose Hall of Residence", short: "Hall-9 (SNB)", category: "hostel", lat: 23.5398, lng: 87.2972, description: "Boys hostel. Named after physicist Satyendra Nath Bose." },
  { id: "hall-11", name: "Hall-11 — Meghnad Saha Hall of Residence", short: "Hall-11 (MS)", category: "hostel", lat: 23.5396, lng: 87.2960, description: "Boys hostel — primarily for 1st year freshers. Has Wi-Fi and a canteen on 3rd floor offering 100+ dishes." },
  { id: "hall-12", name: "Hall-12 — A.P.J. Abdul Kalam International Hostel", short: "Hall-12 (APJ)", category: "hostel", lat: 23.5394, lng: 87.2976, description: "International hostel for exchange students and international scholars. Named after Dr. A.P.J. Abdul Kalam." },
  { id: "hall-14", name: "Hall-14 — Dr B. R. Ambedkar Hall of Residence", short: "Hall-14 (BRA)", category: "hostel", lat: 23.5392, lng: 87.2980, description: "Boys hostel — 12-storey building, primarily for 1st and 2nd year students. Has 6 lifts. Newest and largest hall." },
  { id: "hall-7", name: "Hall-7 — Sister Nivedita Hall of Residence", short: "Hall-7 (SN) Girls", category: "hostel", lat: 23.5415, lng: 87.2972, description: "Girls hostel. Named after Sister Nivedita. Has common room, indoor games, TV." },
  { id: "hall-8", name: "Hall-8 — Preetilata Waddader Hall of Residence", short: "Hall-8 (PW) Girls", category: "hostel", lat: 23.5413, lng: 87.2976, description: "Girls hostel. Named after revolutionary Preetilata Waddader." },
  { id: "hall-10", name: "Hall-10 — Mother Teresa Hall of Residence", short: "Hall-10 (MT) Girls", category: "hostel", lat: 23.5417, lng: 87.2969, description: "Girls hostel. Named after Mother Teresa." },
  { id: "hall-13", name: "Hall-13 — Sarojini Naidu Hall of Residence", short: "Hall-13 (SN2) Girls", category: "hostel", lat: 23.5419, lng: 87.2974, description: "Girls hostel — double occupancy rooms. Named after Sarojini Naidu. Has 24×7 internet." },
];

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  landmark:   { label: "Landmark",     color: "#e63946" },
  academic:   { label: "Academic",     color: "#1d3557" },
  classroom:  { label: "Classroom",    color: "#457b9d" },
  department: { label: "Department",   color: "#2d6a4f" },
  lab:        { label: "Lab / Centre", color: "#6a0572" },
  hostel:     { label: "Hostel",       color: "#264653" },
  food:       { label: "Food & Cafe",  color: "#e9c46a" },
  facility:   { label: "Facility",     color: "#52b788" },
};

const CATEGORIES = ["all", "landmark", "academic", "classroom", "department", "lab", "hostel", "food", "facility"];

// ── HAVERSINE ───────────────────────────────────────────────────────────────
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── MARKER ICON ─────────────────────────────────────────────────────────────
function createMarkerIcon(color: string, label: string) {
  const short = label.slice(0, 3);
  return L.divIcon({
    className: "",
    html: `<div style="width:36px;height:36px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;"><span style="color:#fff;font-size:10px;font-weight:700;line-height:1;text-align:center">${short}</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

// ── USER DOT ────────────────────────────────────────────────────────────────
function createUserIcon() {
  return L.divIcon({
    className: "",
    html: `<div class="campus-user-dot"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

const CampusMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof CAMPUS_LOCATIONS>([]);
  const [showResults, setShowResults] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ name: string; dist: number; time: number } | null>(null);
  const [warning, setWarning] = useState("");
  const [gpsStatus, setGpsStatus] = useState("");

  // Filter locations
  const filteredLocations = CAMPUS_LOCATIONS.filter((loc) => {
    const matchCat = activeCategory === "all" || loc.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      loc.name.toLowerCase().includes(q) ||
      loc.short.toLowerCase().includes(q) ||
      loc.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // Search handler
  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const lower = q.toLowerCase();
    const results = CAMPUS_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(lower) ||
        loc.short.toLowerCase().includes(lower) ||
        loc.description.toLowerCase().includes(lower)
    ).slice(0, 8);
    setSearchResults(results);
    setShowResults(true);
  }, []);

  const flyTo = useCallback((lat: number, lng: number, id: string) => {
    const map = mapInstance.current;
    if (!map) return;
    map.flyTo([lat, lng], 18, { duration: 0.8 });
    const marker = markersRef.current.find((m) => (m as any)._locId === id);
    if (marker) marker.openPopup();
    setShowResults(false);
  }, []);

  // Clear route
  const clearRoute = useCallback(() => {
    if (routeLayerRef.current && mapInstance.current) {
      mapInstance.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    if (userMarkerRef.current && mapInstance.current) {
      mapInstance.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setRouteInfo(null);
    setWarning("");
    setGpsStatus("");
  }, []);

  // Get directions
  const getDirections = useCallback(
    (destLat: number, destLng: number, destName: string) => {
      const map = mapInstance.current;
      if (!map) return;

      if (!navigator.geolocation) {
        window.open(`https://www.google.com/maps?q=${destLat},${destLng}`, "_blank");
        return;
      }

      setGpsStatus("📡 Getting your location...");

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsStatus("");
          const uLat = pos.coords.latitude;
          const uLng = pos.coords.longitude;
          const dist = haversineKm(uLat, uLng, destLat, destLng);

          if (dist > 100) {
            setWarning("⚠️ You are more than 100km from campus. Directions shown may be inaccurate.");
          } else {
            setWarning("");
          }

          // Clear previous route
          if (routeLayerRef.current) map.removeLayer(routeLayerRef.current);
          if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);

          // Fetch OSRM route
          fetch(
            `https://router.project-osrm.org/route/v1/walking/${uLng},${uLat};${destLng},${destLat}?overview=full&geometries=geojson`
          )
            .then((r) => r.json())
            .then((data) => {
              if (data.routes && data.routes.length > 0) {
                const coords = data.routes[0].geometry.coordinates.map(
                  (c: [number, number]) => [c[1], c[0]] as [number, number]
                );
                const polyline = L.polyline(coords, {
                  color: "hsl(210,100%,52%)",
                  weight: 5,
                  opacity: 0.8,
                });
                polyline.addTo(map);
                routeLayerRef.current = polyline;

                const routeDist = data.routes[0].distance / 1000;
                const routeTime = Math.ceil((routeDist / 5) * 60);
                setRouteInfo({ name: destName, dist: routeDist, time: routeTime });

                // User dot
                const userDot = L.marker([uLat, uLng], { icon: createUserIcon() }).addTo(map);
                userMarkerRef.current = userDot;

                map.fitBounds(polyline.getBounds().pad(0.2));

                // Watch position
                if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = navigator.geolocation.watchPosition(
                  (p) => {
                    userMarkerRef.current?.setLatLng([p.coords.latitude, p.coords.longitude]);
                  },
                  () => {},
                  { enableHighAccuracy: true }
                );
              } else {
                // Fallback to Google Maps
                window.open(
                  `https://www.google.com/maps/dir/?api=1&origin=${uLat},${uLng}&destination=${destLat},${destLng}`,
                  "_blank"
                );
              }
            })
            .catch(() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&origin=${uLat},${uLng}&destination=${destLat},${destLng}`,
                "_blank"
              );
            });
        },
        (err) => {
          setGpsStatus("");
          if (err.code === 1) {
            setWarning("Location access denied. Please enable GPS.");
          } else {
            setWarning("Could not get location. Try again.");
          }
          setTimeout(() => setWarning(""), 5000);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    },
    []
  );

  // Expose for popups
  useEffect(() => {
    (window as any).__campusGetDirections = getDirections;
    return () => {
      delete (window as any).__campusGetDirections;
    };
  }, [getDirections]);

  // Init map
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

    if (window.innerWidth < 768) {
      map.on("click", () => map.scrollWheelZoom.enable());
      map.on("mouseout", () => map.scrollWheelZoom.disable());
    }

    mapInstance.current = map;
    setReady(true);

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update markers when filter changes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    filteredLocations.forEach((loc) => {
      const cfg = CATEGORY_CONFIG[loc.category] || { color: "#888", label: "Other" };
      const icon = createMarkerIcon(cfg.color, loc.short);
      const marker = L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:Inter,system-ui,sans-serif;min-width:180px">
            <strong style="font-size:14px">${loc.name}</strong>
            <p style="margin:4px 0 8px;font-size:12px;color:#666">${loc.description}</p>
            <button onclick="window.__campusGetDirections(${loc.lat},${loc.lng},'${loc.name.replace(/'/g, "\\'")}')" style="display:inline-flex;align-items:center;gap:4px;padding:6px 12px;border-radius:8px;background:hsl(210,100%,52%);color:#fff;border:none;font-size:12px;font-weight:500;cursor:pointer">
              📍 Get Directions
            </button>
          </div>`,
          { className: "leaflet-popup-themed" }
        );
      (marker as any)._locId = loc.id;
      markersRef.current.push(marker);
    });
  }, [filteredLocations]);

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search buildings, labs, hostels, canteens..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="flex h-10 w-full rounded-xl border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-12 left-0 right-0 z-50 rounded-xl border border-border bg-card shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            {searchResults.map((loc) => (
              <button
                key={loc.id}
                onMouseDown={() => flyTo(loc.lat, loc.lng, loc.id)}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-muted/50 transition-colors"
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: CATEGORY_CONFIG[loc.category]?.color || "#888" }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{loc.name}</p>
                  <p className="text-xs text-muted-foreground">{CATEGORY_CONFIG[loc.category]?.label}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const cfg = cat === "all" ? null : CATEGORY_CONFIG[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              {cat === "all" ? "All" : cfg?.label}
            </button>
          );
        })}
      </div>

      {/* GPS status */}
      {gpsStatus && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 text-sm text-muted-foreground">
          <span className="animate-spin">⏳</span> {gpsStatus}
        </div>
      )}

      {/* Warning */}
      {warning && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-700 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {warning}
        </div>
      )}

      {/* Map */}
      <div
        className="overflow-hidden rounded-2xl border border-border"
        style={{
          height: window.innerWidth >= 768 ? "65vh" : "50vh",
          opacity: ready ? 1 : 0,
          transition: "opacity 400ms ease-out",
        }}
      >
        <div ref={mapRef} className="h-full w-full" />
      </div>

      {/* Route info */}
      {routeInfo && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 min-w-0">
            <Navigation className="h-5 w-5 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">🚶 Walking to {routeInfo.name}</p>
              <p className="text-xs text-muted-foreground">
                {routeInfo.dist.toFixed(1)} km · ~{routeInfo.time} min
              </p>
            </div>
          </div>
          <button
            onClick={clearRoute}
            className="shrink-0 p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Location cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredLocations.map((loc) => {
          const cfg = CATEGORY_CONFIG[loc.category] || { color: "#888", label: "Other" };
          return (
            <div
              key={loc.id}
              className="scroll-reveal rounded-xl border border-border bg-card p-4 flex flex-col gap-2"
              style={{ borderLeftWidth: 4, borderLeftColor: cfg.color }}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground leading-tight">{loc.name}</h3>
                <span
                  className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                  style={{ background: cfg.color }}
                >
                  {cfg.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{loc.description}</p>
              <button
                onClick={() => getDirections(loc.lat, loc.lng, loc.name)}
                className="mt-auto self-start flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                <MapPin className="h-3 w-3" /> Get Directions →
              </button>
            </div>
          );
        })}
      </div>

      {/* CSS for pulsing user dot */}
      <style>{`
        .campus-user-dot {
          width: 20px; height: 20px; border-radius: 50%;
          background: hsl(210,100%,52%);
          border: 3px solid white;
          box-shadow: 0 0 0 0 rgba(59,130,246,0.5);
          animation: campusPulse 2s infinite;
        }
        @keyframes campusPulse {
          0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.5); }
          70% { box-shadow: 0 0 0 12px rgba(59,130,246,0); }
          100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CampusMap;
