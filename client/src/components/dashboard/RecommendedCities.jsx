import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../common/Card.jsx';

export default function RecommendedCities({ cities = [], loading }) {
  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="min-w-[220px] h-40 rounded-2xl bg-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
      {cities.slice(0, 6).map((city, i) => (
        <motion.div
          key={city._id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="snap-start min-w-[220px]"
        >
          <Link to={`/cities?highlight=${city._id}`}>
            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={city.coverImage}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="font-bold">{city.name}</p>
                  <p className="text-xs opacity-90">{city.country}</p>
                  <p className="text-xs mt-1">{'$'.repeat(city.costIndex)}</p>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
