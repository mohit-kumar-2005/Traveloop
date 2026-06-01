import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Plane, MapPin, Sparkles } from 'lucide-react';
import { UNSPLASH } from '../../data/landingContent.js';

export default function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2 lg:items-center lg:gap-8 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-white/60 px-4 py-1.5 text-sm font-medium text-teal-800 shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-cyan-500" />
            AI-powered travel planning
          </motion.span>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-navy sm:text-5xl lg:text-6xl xl:text-7xl">
            Plan Your Perfect Journey with{' '}
            <span className="text-gradient-brand">Traveloop</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl mx-auto lg:mx-0">
            Intelligent itineraries, real-time suggestions, and budget clarity — so you spend less
            time planning and more time exploring.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Link
              to="/signup"
              className="group inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 px-8 text-base font-semibold text-white shadow-glow transition-all hover:shadow-glow-sm hover:brightness-105 active:scale-[0.98] w-full sm:w-auto"
            >
              Start Exploring
              <Plane className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <a
              href="#ai-planner"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/70 px-8 text-base font-semibold text-navy backdrop-blur-sm transition-all hover:border-teal-300 hover:bg-white w-full sm:w-auto"
            >
              <Play className="h-5 w-5 text-cyan-600" />
              Watch Demo
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="relative mx-auto w-full max-w-xl lg:max-w-none"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/60 bg-white/40 shadow-2xl shadow-teal-900/10 backdrop-blur-sm">
            <img
              src={UNSPLASH.hero}
              alt="Travel destination"
              className="h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-4 top-4 right-4 rounded-2xl glass-panel-light p-4 shadow-lg"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-teal-700">Live itinerary</p>
              <p className="mt-1 font-heading text-lg font-semibold text-navy">Tokyo → Kyoto</p>
              <p className="text-sm text-slate-600">7 days · curated by AI</p>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute bottom-4 left-4 max-w-[200px] rounded-2xl border border-emerald-200/60 bg-emerald-soft/90 p-3 shadow-lg backdrop-blur-md"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
                <MapPin className="h-4 w-4 shrink-0" />
                Budget on track
              </div>
              <p className="mt-1 text-xs text-emerald-800/90">+$240 saved vs estimate</p>
            </motion.div>
            <motion.div
              className="absolute -right-8 top-1/3 hidden w-48 rounded-2xl glass-panel-light p-4 shadow-xl sm:block"
              animate={{ rotate: [0, -2, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
              </div>
              <p className="mt-2 text-xs text-slate-600">Trip confidence</p>
              <p className="font-heading text-2xl font-bold text-navy">94%</p>
            </motion.div>
          </div>
          <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-teal-400/20 via-cyan-400/15 to-emerald-400/20 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}
