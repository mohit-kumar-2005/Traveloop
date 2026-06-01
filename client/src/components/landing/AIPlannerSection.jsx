import { motion } from 'framer-motion';
import {
  Bot,
  Zap,
  Wallet,
  TrendingUp,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export default function AIPlannerSection() {
  return (
    <section
      id="ai-planner"
      className="scroll-mt-24 relative py-20 md:py-28 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white via-teal-50/40 to-white pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-heading text-sm font-semibold uppercase tracking-widest text-cyan-600">
              AI Travel Planner
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-navy md:text-4xl">
              Your intelligent copilot for every trip
            </h2>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Traveloop synthesizes destinations, timing, and budget into a living itinerary — with
              smart recommendations you can refine in seconds.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: Bot, text: 'Natural-language trip briefs → structured plans' },
                { icon: Zap, text: 'Real-time suggestions as conditions change' },
                { icon: Wallet, text: 'Budget optimization across transport, stay, and dining' },
                { icon: TrendingUp, text: 'Confidence scores & what-if budget scenarios' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-slate-700 pt-1.5">{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-2xl backdrop-blur-xl md:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-navy">Itinerary draft</p>
                    <p className="text-xs text-slate-500">Updated just now</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-soft px-3 py-1 text-xs font-semibold text-emerald-800">
                  Live
                </span>
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-4 w-4" />
                  Mar 14 – Mar 21 · Lisbon & Porto
                </div>
                {['Optimize train vs flight · save $120', 'Add sunset sail · high rating'].map((s) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0.8 }}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50/50 px-4 py-3"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600 mt-0.5" />
                    <span className="text-sm text-slate-800">{s}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400"
                  initial={{ width: '0%' }}
                  whileInView={{ width: '78%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
              <p className="mt-2 text-right text-xs text-slate-500">Plan completeness 78%</p>
            </div>
            <div className="absolute -z-10 -bottom-6 -right-6 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
