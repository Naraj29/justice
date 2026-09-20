import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Filter, X, AlertTriangle, MapPin, ArrowRight } from "lucide-react";
import CategoryBadge from "../components/CategoryBadge";
import { getReports, subscribe, CATEGORIES, INDIA_STATES } from "../store/reportsStore";

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createCustomIcon(category) {
  const cat = CATEGORIES[category] || { color: "#e63946", icon: "📌" };
  const color = cat.color;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <filter id="shadow">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${color}" flood-opacity="0.5"/>
      </filter>
      <path d="M18 2C10.268 2 4 8.268 4 16c0 10 14 26 14 26S32 26 32 16C32 8.268 25.732 2 18 2z"
        fill="${color}" filter="url(#shadow)" opacity="0.9"/>
      <circle cx="18" cy="16" r="8" fill="white" opacity="0.2"/>
      <text x="18" y="21" text-anchor="middle" font-size="12" font-family="system-ui">${cat.icon}</text>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
    className: "",
  });
}

function FlyToIndia() {
  const map = useMap();
  useEffect(() => {
    map.setView([20.5937, 78.9629], 5);
  }, [map]);
  return null;
}

export default function MapView() {
  const [reports, setReports] = useState(getReports());
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSeverity, setActiveSeverity] = useState("all");
  const [activeState, setActiveState] = useState("All States");

  useEffect(() => {
    return subscribe(setReports);
  }, []);

  const filtered = reports.filter((r) => {
    const catOk = activeCategory === "all" || r.category === activeCategory;
    const sevOk = activeSeverity === "all" || r.severity === activeSeverity;
    const stateOk = activeState === "All States" || r.state === activeState;
    return catOk && sevOk && stateOk;
  });

  return (
    <div className="relative map-container flex">
      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          className="h-full w-full"
          zoomControl={true}
        >
          <FlyToIndia />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {filtered.map((report) => (
            <Marker
              key={report.id}
              position={[report.location.lat, report.location.lng]}
              icon={createCustomIcon(report.category)}
            >
              <Popup maxWidth={280}>
                <div className="min-w-[240px]">
                  <div className="mb-2">
                    <CategoryBadge category={report.category} />
                  </div>
                  <h3 className="font-semibold text-white text-sm leading-snug mb-2">
                    {report.title}
                  </h3>
                  <p className="text-xs text-white/50 mb-3 line-clamp-2">
                    {report.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {report.location.name}
                    </span>
                    <Link
                      to={`/report/${report.id}`}
                      className="text-xs text-justice-400 hover:text-justice-300 flex items-center gap-1 font-medium transition-colors"
                    >
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map header overlay */}
        <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between gap-3 pointer-events-none">
          <div className="glass-card px-4 py-2.5 pointer-events-auto">
            <span className="text-sm font-semibold text-white">
              🗺️ Live Incident Map
            </span>
            <span className="ml-3 text-xs text-white/50">
              {filtered.length} incidents visible
            </span>
          </div>
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className="glass-card px-4 py-2.5 flex items-center gap-2 text-sm text-white/80 hover:text-white pointer-events-auto cursor-pointer transition-all"
            id="map-filter-btn"
          >
            <Filter className="w-4 h-4" />
            Filters
            {(activeCategory !== "all" || activeSeverity !== "all" || activeState !== "All States") && (
              <span className="w-2 h-2 bg-justice-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Filter sidebar */}
      {filterOpen && (
        <div className="absolute top-0 right-0 h-full w-72 z-[500] bg-dark-800/95 backdrop-blur-xl border-l border-white/[0.08] overflow-y-auto">
          <div className="p-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white">Filters</h3>
              <button
                onClick={() => setFilterOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/[0.08] text-white/60 hover:text-white transition-colors"
                id="close-filter-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category */}
            <div className="mb-6">
              <p className="label">Category</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeCategory === "all"
                      ? "bg-justice-600/20 text-justice-400 border border-justice-600/30"
                      : "bg-white/[0.04] text-white/60 border border-white/10 hover:bg-white/[0.08]"
                  }`}
                >
                  All
                </button>
                {Object.entries(CATEGORIES).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeCategory === key
                        ? `${val.bg} ${val.text} border border-current/30`
                        : "bg-white/[0.04] text-white/60 border border-white/10 hover:bg-white/[0.08]"
                    }`}
                  >
                    {val.icon} {val.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div className="mb-6">
              <p className="label">Severity</p>
              <div className="flex flex-col gap-2">
                {[
                  { k: "all", label: "All Severities", color: "#ffffff80" },
                  { k: "critical", label: "Critical", color: "#e63946" },
                  { k: "high", label: "High", color: "#f97316" },
                  { k: "medium", label: "Medium", color: "#eab308" },
                  { k: "low", label: "Low", color: "#22c55e" },
                ].map(({ k, label, color }) => (
                  <button
                    key={k}
                    onClick={() => setActiveSeverity(k)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                      activeSeverity === k
                        ? "bg-white/[0.08] border border-white/15"
                        : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: color }}
                    />
                    <span className="text-white/80">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* State */}
            <div className="mb-6">
              <p className="label">State</p>
              <select
                value={activeState}
                onChange={(e) => setActiveState(e.target.value)}
                className="input-field"
                id="state-filter-select"
              >
                {INDIA_STATES.map((s) => (
                  <option key={s} value={s} className="bg-dark-600">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                setActiveCategory("all");
                setActiveSeverity("all");
                setActiveState("All States");
              }}
              className="btn-ghost w-full justify-center text-sm"
              id="reset-filters-btn"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Report now FAB */}
      <Link
        to="/report"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] btn-primary px-6 py-3 shadow-red-lg animate-pulse2"
        id="map-report-fab"
      >
        <AlertTriangle className="w-4 h-4" />
        Report an Incident
      </Link>
    </div>
  );
}
