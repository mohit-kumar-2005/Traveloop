import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WelcomeBanner({ name }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-r from-teal-400 to-primary p-8 text-dark shadow-md mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Welcome back, {name?.split(' ')[0] || 'Traveler'}!
        </h1>
        <p className="mt-2 text-slate-800/90 leading-relaxed">
          Plan routes, track budgets, and share adventures — all in one loop.
        </p>
      </div>
      <Link
        to="/trips/new"
        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-dark text-white font-semibold shadow-lg hover:brightness-110 transition-all active:scale-[0.97] min-h-[48px]"
      >
        <Plane className="w-5 h-5" />
        Plan New Trip
      </Link>
    </motion.div>
  );
}
