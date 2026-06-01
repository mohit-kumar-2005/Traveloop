import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { fetchPopularCities } from '../../services/cityService.js';
import { FALLBACK_DESTINATIONS } from '../../data/landingContent.js';

export default function DestinationsSection() {
  const { data, isError } = useQuery({
    queryKey: ['landing-popular-cities'],
    queryFn: fetchPopularCities,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const apiCities = !isError && data?.cities ? data.cities : [];
  const cards =
    apiCities.length >= 4
      ? apiCities.slice(0, 4).map((c) => ({
          id: c._id,
          name: c.name,
          country: c.country,
          image: c.coverImage,
          rating: Math.min(5, 4.15 + (Number(c.popularity) % 20) / 25),
          price: 699 + (Number(c.popularity) % 50) * 38,
        }))
      : FALLBACK_DESTINATIONS;

  return (
    <section id="destinations" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-teal-600">
            Popular destinations
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-navy md:text-4xl">
            Curated escapes for every mood
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Stunning places our travelers love — with smart price signals and community picks.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((d, i) => (
            <motion.article
              key={d.id || d.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, rotateX: 2 }}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-card transition-shadow duration-300 hover:shadow-xl"
              style={{ perspective: '1200px' }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={d.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <div className="flex items-center gap-1 text-amber-300">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">{Number(d.rating).toFixed(1)}</span>
                </div>
                <h3 className="mt-1 font-heading text-xl font-bold">{d.name}</h3>
                <p className="flex items-center gap-1 text-sm text-white/85">
                  <MapPin className="h-3.5 w-3.5" />
                  {d.country}
                </p>
                <p className="mt-2 text-sm font-semibold text-teal-200">
                  From ${typeof d.price === 'number' ? Math.round(d.price) : d.price}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
