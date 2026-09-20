import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Scale, Map, Newspaper, AlertTriangle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { to: "/",      label: "Home",      icon: Scale },
  { to: "/map",   label: "Live Map",  icon: Map },
  { to: "/feed",  label: "Feed",      icon: Newspaper },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-dark-800/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-justice-600 rounded-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                <Scale className="w-5 h-5 text-justice-500 relative z-10" />
              </div>
              <div>
                <span className="font-display font-bold text-base text-white">JusticeMap</span>
                <span className="text-justice-500 font-bold text-base"> India</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-justice-600/15 text-justice-400 border border-justice-600/30"
                        : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/report" className="btn-primary animate-pulse2">
                <AlertTriangle className="w-4 h-4" />
                Report Now
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              className="md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.05]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-dark-800/95 backdrop-blur-xl border-b border-white/[0.08] md:hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-justice-600/15 text-justice-400"
                        : "text-white/70 hover:text-white hover:bg-white/[0.05]"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
              <Link to="/report" className="btn-primary mt-2 justify-center">
                <AlertTriangle className="w-4 h-4" />
                Report Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
