import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle, Map, Newspaper, ArrowRight,
  TrendingUp, Users, Globe2, ShieldCheck,
} from "lucide-react";
import ReportCard from "../components/ReportCard";
import AnimatedCounter from "../components/AnimatedCounter";
import { getReports, getStats } from "../store/reportsStore";

const FEATURES = [
  {
    icon: Map,
    color: "text-ocean-400",
    bg: "bg-ocean-500/10",
    title: "Interactive Map",
    desc: "Visualise every incident pinned across India in real-time.",
  },
  {
    icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Verified Reports",
    desc: "Community-verified incidents with evidence trails.",
  },
  {
    icon: TrendingUp,
    color: "text-justice-400",
    bg: "bg-justice-500/10",
    title: "Trending Stories",
    desc: "Reports that are gaining traction and demanding action.",
  },
  {
    icon: Globe2,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    title: "Amplify & Share",
    desc: "One click to spread awareness on any platform.",
  },
];

export default function Home() {
  const reports = getReports().slice(0, 6);
  const stats = getStats();

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden noise">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-justice-600/[0.07] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-ocean-500/[0.06] rounded-full blur-[100px] pointer-events-none" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-justice-600/30 bg-justice-600/10 text-justice-400 text-sm font-medium mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-justice-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-justice-500" />
              </span>
              Live — {stats.total} incidents reported across India
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6"
            >
              Every Injustice
              <br />
              <span className="text-gradient">Deserves a Voice.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-white/60 leading-relaxed mb-10 max-w-2xl"
            >
              JusticeMap India is a citizen-powered platform to report corruption,
              police brutality, environmental crime, and rights violations — pin it
              on the map, share it with the world, demand accountability.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/report" className="btn-primary text-base px-8 py-4" id="hero-report-btn">
                <AlertTriangle className="w-5 h-5" />
                File a Report
              </Link>
              <Link to="/map" className="btn-ghost text-base px-8 py-4" id="hero-map-btn">
                <Map className="w-5 h-5" />
                Explore Map
              </Link>
            </motion.div>
          </div>

          {/* Floating stats cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="hidden lg:flex flex-col gap-3 absolute right-8 top-1/2 -translate-y-1/2"
          >
            {[
              { label: "Reports Filed",    value: stats.total,       suffix: "+" },
              { label: "States Covered",   value: stats.states,      suffix: "" },
              { label: "Verified",         value: stats.verified,    suffix: "" },
              { label: "Total Shares",     value: stats.totalShares, suffix: "+" },
            ].map(({ label, value, suffix }) => (
              <div
                key={label}
                className="glass-card px-5 py-3 text-center min-w-[130px]"
              >
                <div className="text-2xl font-bold text-gradient">
                  <AnimatedCounter end={value} suffix={suffix} />
                </div>
                <div className="text-xs text-white/50 mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none" />
      </section>

      {/* ── Stats (mobile) ───────────────────────────────── */}
      <section className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 -mt-8 mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Reports",    value: stats.total,       suffix: "+" },
            { label: "States",     value: stats.states,      suffix: "" },
            { label: "Verified",   value: stats.verified,    suffix: "" },
            { label: "Shares",     value: stats.totalShares, suffix: "+" },
          ].map(({ label, value, suffix }) => (
            <div key={label} className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-gradient">
                <AnimatedCounter end={value} suffix={suffix} />
              </div>
              <div className="text-xs text-white/50 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Why JusticeMap?</h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Built for citizens, by citizens. Every feature exists to make your
            voice louder and harder to ignore.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, color, bg, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <div
                className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mx-auto mb-4`}
              >
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Latest Reports ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title mb-1">Latest Reports</h2>
            <p className="text-white/40 text-sm">Most recently submitted incidents</p>
          </div>
          <Link
            to="/feed"
            className="btn-ghost text-sm"
            id="view-all-reports-btn"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <ReportCard report={report} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden border border-justice-600/20 bg-gradient-to-br from-justice-600/10 to-dark-600 p-12 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(230,57,70,0.12)_0%,_transparent_70%)] pointer-events-none" />
          <Users className="w-12 h-12 text-justice-500 mx-auto mb-4" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Be the change. <span className="text-gradient">Report today.</span>
          </h2>
          <p className="text-white/60 max-w-lg mx-auto mb-8">
            Silence is complicity. If you've witnessed injustice, file a report now.
            It takes 2 minutes. It can change everything.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/report" className="btn-primary text-base px-10 py-4" id="cta-report-btn">
              <AlertTriangle className="w-5 h-5" />
              File a Report
            </Link>
            <Link to="/feed" className="btn-ghost text-base px-10 py-4" id="cta-feed-btn">
              <Newspaper className="w-5 h-5" />
              Read Reports
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-10 text-center text-white/30 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-display font-bold text-white/50 text-lg mb-2">
            JusticeMap India
          </p>
          <p>
            Built with ❤️ for the people of India · Hackathon 2026 ·{" "}
            <a
              href="https://github.com/Naraj29/justice"
              target="_blank"
              rel="noreferrer"
              className="hover:text-justice-400 transition-colors"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
