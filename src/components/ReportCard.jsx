import { Link } from "react-router-dom";
import { MapPin, ThumbsUp, Share2, ShieldCheck, Clock } from "lucide-react";
import { formatDistanceToNow } from "../utils/dateUtils";
import CategoryBadge from "./CategoryBadge";
import { SEVERITY, upvoteReport } from "../store/reportsStore";

export default function ReportCard({ report, compact = false }) {
  const sev = SEVERITY[report.severity] || SEVERITY.medium;

  const handleShare = (e) => {
    e.preventDefault();
    const url = `${window.location.origin}/justice/report/${report.id}`;
    if (navigator.share) {
      navigator.share({ title: report.title, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleUpvote = (e) => {
    e.preventDefault();
    upvoteReport(report.id);
  };

  return (
    <Link
      to={`/report/${report.id}`}
      className="glass-card block p-5 group cursor-pointer"
      id={`report-card-${report.id}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-2">
          <CategoryBadge category={report.category} />
          <span
            className="category-badge text-xs"
            style={{
              background: `${sev.color}20`,
              color: sev.color,
            }}
          >
            ⚠ {sev.label}
          </span>
          {report.verified && (
            <span className="category-badge bg-emerald-500/15 text-emerald-400 text-xs">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3
        className={`font-semibold text-white group-hover:text-justice-300 transition-colors leading-snug ${
          compact ? "text-sm line-clamp-2" : "text-base line-clamp-3"
        }`}
      >
        {report.title}
      </h3>

      {/* Description (not compact) */}
      {!compact && (
        <p className="mt-2 text-sm text-white/50 line-clamp-2 leading-relaxed">
          {report.description}
        </p>
      )}

      {/* Meta */}
      <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {report.location.name}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
        <div className="flex items-center gap-4 text-xs text-white/50">
          <button
            onClick={handleUpvote}
            className="flex items-center gap-1.5 hover:text-justice-400 transition-colors"
            id={`upvote-${report.id}`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            {report.upvotes.toLocaleString()}
          </button>
          <span className="flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5" />
            {report.shares.toLocaleString()} shares
          </span>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     bg-white/[0.05] hover:bg-justice-600/20 hover:text-justice-300
                     border border-white/10 hover:border-justice-600/30
                     text-white/60 transition-all duration-200"
          id={`share-${report.id}`}
        >
          <Share2 className="w-3 h-3" />
          Share
        </button>
      </div>
    </Link>
  );
}
