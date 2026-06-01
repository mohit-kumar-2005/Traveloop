import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '../common/Logo.jsx';

const links = [
  { href: '#destinations', label: 'Destinations' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#about', label: 'About' },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const navClass = scrolled
    ? 'bg-white/75 shadow-glass backdrop-blur-xl border-b border-white/50'
    : 'bg-white/40 backdrop-blur-md border-b border-white/30';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${navClass}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-2 min-h-[44px]">
          <Logo showText variant="dark" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-navy-light/90 transition-colors hover:bg-teal-500/10 hover:text-teal-700"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-navy hover:bg-slate-100/80 transition-colors min-h-[44px] inline-flex items-center"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow-sm transition-all hover:brightness-110 hover:shadow-glow min-h-[44px] inline-flex items-center"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="rounded-xl p-2.5 text-navy md:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/40 bg-white/90 backdrop-blur-xl px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-navy"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/login"
              className="mt-2 rounded-xl border border-slate-200 px-4 py-3 text-center font-semibold"
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-3 text-center font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
