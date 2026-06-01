import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { STATS } from '../../data/landingContent.js';
import { useCountUp } from '../../hooks/useCountUp.js';

function StatItem({ target, suffix, label }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const value = useCountUp(target, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <p className="font-display text-4xl font-bold text-white md:text-5xl tabular-nums drop-shadow-sm">
        {value}
        {suffix}
      </p>
      <p className="mt-2 font-heading text-sm font-semibold uppercase tracking-wider text-teal-200/90">
        {label}
      </p>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy-light to-ocean opacity-[0.97]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(6,182,212,0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(20,184,166,0.35) 0%, transparent 45%)`,
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-6">
          {STATS.map((s) => (
            <StatItem key={s.label} target={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
