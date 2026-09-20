import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ReportCard from "../components/ReportCard";
import { getReports, subscribe, CATEGORIES, INDIA_STATES } from "../store/reportsStore";

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "trending", label: "Trending" },
  { value: "upvotes", label: "Most Upvoted" },
  { value: "shares", label: "Most Shared" },
];

export default function Feed() {
  const [reports, setReports] = useState(getReports());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");
  const [state, setState] = useState("All States");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    return subscribe(setReports);
  }, []);

  const filtered = reports
    .filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.location.name.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat = category === "all" || r.category === category;
      const matchState = state === "All States" || r.state === state;
      return matchSearch && matchCat && matchState;
    })
    .sort((a, b) => {
      if (sort === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "trending") return b.shares + b.upvotes - (a.shares + a.upvotes);
      if (sort === "upvotes") return b.upvotes - a.upvotes;
      if (sort === "shares") return b.shares - a.shares;
      return 0;
    });

  const hasFilters = search || category !== "all" || state !== "All States";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-2">Public Report Feed</h1>
        <p className="text-white/50">
          {filtered.length} reports · Community-verified injustice incidents from across India
        </p>
      </div>

      {/* Search + controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            id="feed-search"
            type="text"
            placeholder="Search reports, locations, tags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              id="clear-search-btn"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          id="feed-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-field w-auto min-w-[160px]"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-dark-600">
              {o.label}
            </option>
          ))}
        </select>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`btn-ghost flex items-center gap-2 ${
            showFilters ? "border-justice-600/40 text-justice-400" : ""
          }`}
          id="toggle-filters-btn"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasFilters && <span className="w-2 h-2 bg-justice-500 rounded-full" />}
        </button>
      </div>

      {/* Expandable filter row */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-card p-5 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Category */}
            <div className="flex-1">
              <p className="label">Category</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => setCategory("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    category === "all"
                      ? "bg-justice-600/20 text-justice-400 border border-justice-600/30"
                      : "bg-white/[0.04] text-white/60 border border-white/10"
                  }`}
                >
                  All Categories
                </button>
                {Object.entries(CATEGORIES).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setCategory(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      category === key
                        ? `${val.bg} ${val.text} border border-white/10`
                        : "bg-white/[0.04] text-white/60 border border-white/10"
                    }`}
                  >
                    {val.icon} {val.label}
                  </button>
                ))}
              </div>
            </div>

            {/* State */}
            <div className="min-w-[200px]">
              <p className="label">State</p>
              <select
                id="feed-state-filter"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="input-field mt-2"
              >
                {INDIA_STATES.map((s) => (
                  <option key={s} value={s} className="bg-dark-600">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={() => { setSearch(""); setCategory("all"); setState("All States"); }}
              className="mt-4 text-xs text-justice-400 hover:text-justice-300 underline underline-offset-2 transition-colors"
              id="clear-all-filters-btn"
            >
              Clear all filters
            </button>
          )}
        </motion.div>
      )}

      {/* Category pills quick-filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {[{ k: "all", label: "All", icon: "📋" }, ...Object.entries(CATEGORIES).map(([k, v]) => ({ k, label: v.label, icon: v.icon }))].map(
          ({ k, label, icon }) => (
            <button
              key={k}
              onClick={() => setCategory(k)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                category === k
                  ? "bg-justice-600 text-white shadow-red"
                  : "bg-dark-500 text-white/60 border border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              <span>{icon}</span> {label}
            </button>
          )
        )}
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
            >
              <ReportCard report={report} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-16 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-semibold text-white mb-2">No reports found</h3>
          <p className="text-white/50 text-sm">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </main>
  );
}
