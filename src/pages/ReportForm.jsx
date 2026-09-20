import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, CheckCircle2,
  AlertTriangle, MapPin, FileText, Upload, Send,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { addReport, CATEGORIES, INDIA_STATES, SEVERITY } from "../store/reportsStore";

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationPicker({ position, onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

const STEPS = [
  { label: "Category",    icon: AlertTriangle },
  { label: "Location",    icon: MapPin },
  { label: "Details",     icon: FileText },
  { label: "Submit",      icon: Send },
];

const INITIAL = {
  category: "",
  severity: "high",
  title: "",
  description: "",
  author: "",
  tags: "",
  state: "",
  locationName: "",
  lat: null,
  lng: null,
};

export default function ReportForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validateStep = () => {
    const e = {};
    if (step === 0 && !form.category) e.category = "Please select a category";
    if (step === 1) {
      if (!form.lat) e.location = "Click on the map to pin a location";
      if (!form.locationName.trim()) e.locationName = "Enter a location name";
      if (!form.state) e.state = "Select a state";
    }
    if (step === 2) {
      if (!form.title.trim() || form.title.length < 10) e.title = "Title must be at least 10 characters";
      if (!form.description.trim() || form.description.length < 30) e.description = "Description must be at least 30 characters";
      if (!form.author.trim()) e.author = "Enter your name or alias";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep((s) => s + 1); };
  const back = () => setStep((s) => s - 1);

  const handleSubmit = () => {
    const report = {
      id: uuidv4(),
      title: form.title,
      description: form.description,
      category: form.category,
      severity: form.severity,
      location: { lat: form.lat, lng: form.lng, name: form.locationName },
      state: form.state,
      mediaUrl: null,
      author: form.author,
      verified: false,
      upvotes: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    addReport(report);
    setSubmitted(true);
    setTimeout(() => navigate(`/report/${report.id}`), 2500);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">Report Filed!</h2>
          <p className="text-white/60 text-sm mb-2">
            Your incident has been pinned on the map and added to the public feed.
          </p>
          <p className="text-white/40 text-xs">Redirecting to your report…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">File an Incident Report</h1>
        <p className="text-white/50">
          Your report will be pinned on the public map and added to the feed.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map(({ label, icon: Icon }, i) => (
          <div key={label} className="flex items-center gap-2 flex-1 last:flex-initial">
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                i < step
                  ? "bg-emerald-500 text-white"
                  : i === step
                  ? "bg-justice-600 text-white ring-4 ring-justice-600/20"
                  : "bg-dark-500 text-white/40 border border-white/10"
              }`}
            >
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${
                i === step ? "text-white" : "text-white/40"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-px mx-1 transition-all ${
                  i < step ? "bg-emerald-500/50" : "bg-white/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >

          {/* Step 0 — Category */}
          {step === 0 && (
            <div className="glass-card p-6">
              <h2 className="font-semibold text-white text-lg mb-1">Select a Category</h2>
              <p className="text-sm text-white/50 mb-6">What type of injustice are you reporting?</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.entries(CATEGORIES).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => set("category", key)}
                    id={`cat-${key}`}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${
                      form.category === key
                        ? `${val.bg} ${val.text} border-current/40 shadow-lg`
                        : "border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="text-2xl">{val.icon}</span>
                    <div>
                      <div className={`font-semibold text-sm ${form.category === key ? val.text : "text-white"}`}>
                        {val.label}
                      </div>
                    </div>
                    {form.category === key && (
                      <CheckCircle2 className={`w-5 h-5 ml-auto ${val.text}`} />
                    )}
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="mt-3 text-xs text-justice-400">{errors.category}</p>
              )}

              {/* Severity */}
              {form.category && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6"
                >
                  <p className="label">Severity Level</p>
                  <div className="flex gap-2 mt-2">
                    {Object.entries(SEVERITY).map(([k, v]) => (
                      <button
                        key={k}
                        onClick={() => set("severity", k)}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          form.severity === k
                            ? "border-current"
                            : "border-white/10 text-white/50 hover:border-white/20"
                        }`}
                        style={form.severity === k ? { color: v.color, background: `${v.color}18` } : {}}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Step 1 — Location */}
          {step === 1 && (
            <div className="glass-card p-6">
              <h2 className="font-semibold text-white text-lg mb-1">Pin the Location</h2>
              <p className="text-sm text-white/50 mb-4">Click anywhere on the map to mark where the incident occurred.</p>

              <div className="rounded-xl overflow-hidden border border-white/10 mb-4" style={{ height: 320 }}>
                <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker
                    position={form.lat ? { lat: form.lat, lng: form.lng } : null}
                    onPick={(pos) => { set("lat", pos.lat); set("lng", pos.lng); }}
                  />
                </MapContainer>
              </div>

              {form.lat && (
                <p className="text-xs text-emerald-400 mb-4 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Location pinned: {form.lat.toFixed(4)}, {form.lng.toFixed(4)}
                </p>
              )}
              {errors.location && (
                <p className="text-xs text-justice-400 mb-4">{errors.location}</p>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="location-name">Location Name</label>
                  <input
                    id="location-name"
                    type="text"
                    placeholder="e.g. Jantar Mantar, Delhi"
                    value={form.locationName}
                    onChange={(e) => set("locationName", e.target.value)}
                    className="input-field"
                  />
                  {errors.locationName && (
                    <p className="mt-1 text-xs text-justice-400">{errors.locationName}</p>
                  )}
                </div>
                <div>
                  <label className="label" htmlFor="state-select">State</label>
                  <select
                    id="state-select"
                    value={form.state}
                    onChange={(e) => set("state", e.target.value)}
                    className="input-field"
                  >
                    <option value="" className="bg-dark-600">Select state…</option>
                    {INDIA_STATES.slice(1).map((s) => (
                      <option key={s} value={s} className="bg-dark-600">{s}</option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="mt-1 text-xs text-justice-400">{errors.state}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Details */}
          {step === 2 && (
            <div className="glass-card p-6 space-y-5">
              <div>
                <h2 className="font-semibold text-white text-lg mb-1">Describe the Incident</h2>
                <p className="text-sm text-white/50">Provide as much detail as possible — this is public record.</p>
              </div>

              <div>
                <label className="label" htmlFor="report-title">Headline / Title *</label>
                <input
                  id="report-title"
                  type="text"
                  placeholder="Brief, factual title describing what happened"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className="input-field"
                />
                {errors.title && <p className="mt-1 text-xs text-justice-400">{errors.title}</p>}
              </div>

              <div>
                <label className="label" htmlFor="report-description">Full Description *</label>
                <textarea
                  id="report-description"
                  rows={5}
                  placeholder="Describe what happened, who was involved, when, and what evidence exists…"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="input-field resize-none"
                />
                <div className="flex justify-between mt-1">
                  {errors.description ? (
                    <p className="text-xs text-justice-400">{errors.description}</p>
                  ) : <span />}
                  <span className="text-xs text-white/30">
                    {form.description.length} chars (min 30)
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="report-author">Your Name / Alias *</label>
                  <input
                    id="report-author"
                    type="text"
                    placeholder="Your name or 'Anonymous'"
                    value={form.author}
                    onChange={(e) => set("author", e.target.value)}
                    className="input-field"
                  />
                  {errors.author && <p className="mt-1 text-xs text-justice-400">{errors.author}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="report-tags">Tags (comma-separated)</label>
                  <input
                    id="report-tags"
                    type="text"
                    placeholder="e.g. police, corruption, students"
                    value={form.tags}
                    onChange={(e) => set("tags", e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Media placeholder */}
              <div
                className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer
                           hover:border-justice-600/40 hover:bg-justice-600/5 transition-all"
              >
                <Upload className="w-8 h-8 text-white/30 mx-auto mb-2" />
                <p className="text-sm text-white/40">
                  Drag & drop photos/videos or{" "}
                  <span className="text-justice-400">browse</span>
                </p>
                <p className="text-xs text-white/25 mt-1">
                  Media upload coming soon — describe evidence in detail above
                </p>
              </div>
            </div>
          )}

          {/* Step 3 — Review & Submit */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h2 className="font-semibold text-white text-lg mb-4">Review & Submit</h2>

                <div className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <span className="text-white/40 w-24 flex-shrink-0">Category</span>
                    <span className="text-white font-medium">
                      {CATEGORIES[form.category]?.icon} {CATEGORIES[form.category]?.label}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-white/40 w-24 flex-shrink-0">Severity</span>
                    <span className="font-medium" style={{ color: SEVERITY[form.severity]?.color }}>
                      {SEVERITY[form.severity]?.label}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-white/40 w-24 flex-shrink-0">Location</span>
                    <span className="text-white">{form.locationName}, {form.state}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-white/40 w-24 flex-shrink-0">Title</span>
                    <span className="text-white font-medium">{form.title}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-white/40 w-24 flex-shrink-0">Author</span>
                    <span className="text-white">{form.author}</span>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-dark-500 rounded-xl">
                  <p className="text-xs text-white/60 leading-relaxed">{form.description}</p>
                </div>

                <div className="mt-5 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <p className="text-xs text-amber-400 leading-relaxed">
                    ⚠ By submitting, you confirm this report is truthful to the best of your knowledge.
                    False reports undermine the platform and may have legal consequences.
                  </p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="btn-primary w-full justify-center text-base py-4"
                id="submit-report-btn"
              >
                <Send className="w-5 h-5" />
                Submit Report to Public Map
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        {step > 0 ? (
          <button onClick={back} className="btn-ghost" id="back-btn">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        ) : (
          <div />
        )}
        {step < STEPS.length - 1 && (
          <button onClick={next} className="btn-primary" id="next-btn">
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </main>
  );
}
