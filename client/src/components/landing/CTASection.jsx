import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-500 via-cyan-500 to-ocean px-8 py-16 text-center shadow-glow md:px-16"
        >
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-gold-light/40 blur-2xl" />
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
              Start Your Next Adventure Today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-teal-50/95">
              Join thousands of travelers who plan smarter with AI — your journey begins in
              minutes.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-white px-8 py-3.5 font-heading font-semibold text-teal-700 shadow-xl transition-all hover:bg-teal-50 active:scale-[0.98]"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#destinations"
                className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border-2 border-white/80 bg-white/10 px-8 py-3.5 font-heading font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Explore Destinations
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
