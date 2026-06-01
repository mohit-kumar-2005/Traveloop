import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '0',
    period: 'forever',
    blurb: 'Essential planning for solo travelers.',
    features: ['Trip workspace', 'Basic itinerary', 'Packing lists', 'Community browse'],
    cta: 'Get started',
    href: '/signup',
    featured: false,
  },
  {
    name: 'Traveloop Pro',
    price: '12',
    period: '/ month',
    blurb: 'AI depth, budgets, and collaboration.',
    features: [
      'AI itinerary + rewrites',
      'Smart budgets & charts',
      'Map routes & stops',
      'Notes & collaboration',
      'Priority sync',
    ],
    cta: 'Start free trial',
    href: '/signup',
    featured: true,
  },
  {
    name: 'Teams',
    price: '29',
    period: '/ month',
    blurb: 'For agencies and travel curators.',
    features: ['All Pro features', 'Admin insights', 'Shared libraries', 'Dedicated support'],
    cta: 'Contact sales',
    href: '/signup',
    featured: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24 py-20 md:py-28 bg-slate-50/80">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-teal-600">
            Pricing
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy md:text-4xl">
            Simple plans — upgrade when you’re ready
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Start free. Pro unlocks the full AI planning suite your trips deserve.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`relative flex flex-col rounded-3xl border p-8 shadow-card transition-all hover:shadow-xl ${
                plan.featured
                  ? 'border-teal-300 bg-white ring-2 ring-teal-400/30 scale-[1.02] z-[1]'
                  : 'border-slate-100 bg-white'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-1 text-xs font-bold text-white shadow-md">
                  Most popular
                </span>
              )}
              <h3 className="font-heading text-xl font-bold text-navy">{plan.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{plan.blurb}</p>
              <p className="mt-6 font-display text-4xl font-bold text-navy">
                ${plan.price}
                <span className="text-lg font-normal text-slate-500">{plan.period}</span>
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-slate-700">
                    <Check className="h-5 w-5 shrink-0 text-teal-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.href}
                className={`mt-8 inline-flex min-h-[48px] items-center justify-center rounded-2xl px-6 text-center font-semibold transition-all active:scale-[0.98] ${
                  plan.featured
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-glow hover:brightness-110'
                    : 'border-2 border-slate-200 bg-white text-navy hover:border-teal-300 hover:bg-teal-50/50'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-slate-500">
          Billing is illustrative — connect your product catalog when you launch payments.
        </p>
      </div>
    </section>
  );
}
