import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-teal-600">
            About
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy md:text-4xl">
            Built for the future of travel
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            Traveloop combines intelligent planning with elegant design — empowering travelers and
            creators to build journeys that feel personal, transparent, and unmistakably premium.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
