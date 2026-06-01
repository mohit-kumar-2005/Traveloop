import { motion } from 'framer-motion';
import {
  Sparkles,
  Globe,
  Wallet,
  Users,
  Map,
  Cloud,
  Shield,
  Heart,
} from 'lucide-react';
import { FEATURES } from '../../data/landingContent.js';

const iconMap = {
  sparkles: Sparkles,
  globe: Globe,
  wallet: Wallet,
  users: Users,
  map: Map,
  cloud: Cloud,
  shield: Shield,
  heart: Heart,
};

export default function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-teal-600">
            Features
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy md:text-4xl">
            Everything you need for premium travel
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            One platform to dream, plan, book context, and travel with confidence.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => {
            const Icon = iconMap[f.icon] || Sparkles;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-300 hover:border-teal-200/80 hover:shadow-[0_0_40px_-10px_rgba(20,184,166,0.35)]"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-md transition-transform group-hover:scale-105">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-navy">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
