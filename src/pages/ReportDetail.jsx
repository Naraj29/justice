import { useParams, Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import {
  ArrowLeft, Share2, ThumbsUp, MapPin, Clock,
  ShieldCheck, User, Tag, AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow, format } from "../utils/dateUtils";
import CategoryBadge from "../components/CategoryBadge";
import ReportCard from "../components/ReportCard";
import { getReport, getReports, upvoteReport, SEVERITY } from "../store/reportsStore";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const report = getReport(id);

  if (!report) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="font-display text-2xl font-bold text-white mb-2">Report not found</h2>
        <p className="text-white/50 mb-6">This report may have been removed or the link is invalid.</p>
        <Link to="/feed" className="btn-primary">← Back to Feed</Link>
      </div>
    );
  }

  const sev = SEVERITY[report.severity] || SEVERITY.medium;
  const related = getReports()
    .filter((r) => r.id !== id && r.category === report.category)
    .slice(0, 3);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: report.title, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleUpvote = () => upvoteReport(id);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors"
        id="back-to-feed-btn"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2"
          >
            <CategoryBadge category={report.category} size="lg" />
            <span
              className="category-badge px-4 py-1.5 text-sm"
              style={{ background: `${sev.color}20`, color: sev.color }}
            >
              ⚠ {sev.label}
            </span>
            {report.verified && (
              <span className="category-badge bg-emerald-500/15 text-emerald-400 px-4 py-1.5 text-sm">
                <ShieldCheck className="w-4 h-4" />
                Community Verified
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug"
          >
            {report.title}
          </motion.h1>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-4 text-sm text-white/50"
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {report.location.name}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" /> {report.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {format(new Date(report.createdAt), "d MMM yyyy, HH:mm")} ·{" "}
              {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
            </span>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6"
          >
            <p className="text-white/80 leading-relaxed whitespace-pre-wrap text-[15px]">
              {report.description}
            </p>
          </motion.div>

          {/* Tags */}
          {report.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-white/30" />
              {report.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-white/[0.06] text-white/50 text-xs border border-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleUpvote}
              className="btn-ghost flex items-center gap-2"
              id="detail-upvote-btn"
            >
              <ThumbsUp className="w-4 h-4" />
              Upvote ({report.upvotes.toLocaleString()})
            </button>
            <button
              onClick={handleShare}
              className="btn-primary flex items-center gap-2"
              id="detail-share-btn"
            >
              <Share2 className="w-4 h-4" />
              Share Report
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(report.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
              id="share-twitter-btn"
            >
              𝕏 Tweet
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(report.title + " " + window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
              id="share-whatsapp-btn"
            >
              📱 WhatsApp
            </a>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <h3 className="font-semibold text-white mb-4">Related Reports</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map((r) => (
                  <ReportCard key={r.id} report={r} compact />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card overflow-hidden"
          >
            <div style={{ height: 220 }}>
              <MapContainer
                center={[report.location.lat, report.location.lng]}
                zoom={10}
                className="h-full w-full"
                zoomControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[report.location.lat, report.location.lng]}>
                  <Popup>{report.location.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="p-3 flex items-center gap-2 text-sm text-white/60">
              <MapPin className="w-4 h-4 text-justice-400" />
              {report.location.name}
            </div>
          </motion.div>

          {/* Stats card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-5 space-y-4"
          >
            <h4 className="font-semibold text-white text-sm">Report Stats</h4>
            {[
              { label: "Upvotes", value: report.upvotes.toLocaleString() },
              { label: "Shares", value: report.shares.toLocaleString() },
              { label: "State", value: report.state },
              { label: "Status", value: report.verified ? "✅ Verified" : "⏳ Pending Verification" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-white/40">{label}</span>
                <span className="text-white font-medium">{value}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5 text-center border-justice-600/20"
          >
            <AlertTriangle className="w-8 h-8 text-justice-500 mx-auto mb-3" />
            <p className="text-sm text-white/70 mb-4">Witnessed another injustice?</p>
            <Link to="/report" className="btn-primary w-full justify-center" id="sidebar-report-btn">
              File a Report
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
