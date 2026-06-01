import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Facebook, Instagram, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import Logo from '../common/Logo.jsx';

const quickLinks = [
  { to: '/login', label: 'Sign In' },
  { to: '/signup', label: 'Create account' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
];

export default function LandingFooter() {
  const [email, setEmail] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.info('Thanks — you’re on the list!');
    setEmail('');
  };

  return (
    <footer className="border-t border-slate-200/80 bg-navy text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo showText variant="light" />
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              The AI-powered platform for journeys that feel effortless — from first idea to final
              landing.
            </p>
            <div className="mt-6 flex gap-3">
              {[Twitter, Instagram, Facebook, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-teal-500/20 hover:text-white"
                  aria-label="Social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Quick links
            </h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  {l.to ? (
                    <Link to={l.to} className="text-sm text-slate-400 transition-colors hover:text-teal-300">
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} className="text-sm text-slate-400 transition-colors hover:text-teal-300">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                hello@traveloop.com
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                +1 (555) 010-2400
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                100 Harbor View, San Francisco
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Newsletter
            </h3>
            <p className="mt-4 text-sm text-slate-400">
              Trip inspiration and product updates — no spam.
            </p>
            <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-400/50"
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} Traveloop. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-teal-300">
              Privacy
            </a>
            <a href="#" className="hover:text-teal-300">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
