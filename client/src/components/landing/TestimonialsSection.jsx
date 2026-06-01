import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { TESTIMONIALS } from '../../data/landingContent.js';

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);

  const item = TESTIMONIALS[index];

  return (
    <section id="reviews" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-teal-600">
            Reviews
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy md:text-4xl">
            Loved by explorers worldwide
          </h2>
        </motion.div>

        <div className="relative rounded-3xl border border-slate-100 bg-white p-8 shadow-xl md:p-12">
          <Quote className="absolute right-8 top-8 h-10 w-10 text-teal-200/80" />
          <AnimatePresence mode="wait">
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="text-center md:text-left md:pl-4"
            >
              <div className="flex justify-center md:justify-start gap-1 mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-lg leading-relaxed text-slate-700 md:text-xl">“{item.quote}”</p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center md:justify-start">
                <img
                  src={item.avatar}
                  alt=""
                  className="h-14 w-14 rounded-full object-cover ring-4 ring-teal-100"
                  loading="lazy"
                />
                <div className="text-center md:text-left">
                  <p className="font-heading font-semibold text-navy">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="rounded-full border border-slate-200 p-3 transition-colors hover:bg-teal-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? 'w-8 bg-teal-500' : 'w-2 bg-slate-300'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next"
              onClick={() => setIndex((i) => (i + 1) % TESTIMONIALS.length)}
              className="rounded-full border border-slate-200 p-3 transition-colors hover:bg-teal-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
