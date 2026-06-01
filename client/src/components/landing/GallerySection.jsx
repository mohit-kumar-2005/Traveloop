import { motion } from 'framer-motion';
import { GALLERY_IMAGES } from '../../data/landingContent.js';

export default function GallerySection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-teal-600">
            Wanderlust gallery
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy md:text-4xl">
            Moments that inspire the next trip
          </h2>
        </motion.div>

        <div className="columns-2 gap-4 md:columns-3 lg:gap-6">
          {GALLERY_IMAGES.map((src, i) => (
            <motion.figure
              key={src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: (i % 4) * 0.05 }}
              className="mb-4 break-inside-avoid group relative overflow-hidden rounded-2xl"
            >
              <img
                src={src}
                alt=""
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute bottom-3 left-3 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                Explore
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
