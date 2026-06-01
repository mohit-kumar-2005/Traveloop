import { motion } from 'framer-motion';
import TripCard from '../dashboard/TripCard.jsx';
import EmptyState from '../common/EmptyState.jsx';

export default function TripList({ trips, loading, onDelete }) {
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-72 rounded-2xl bg-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }
  if (!trips?.length) {
    return (
      <EmptyState
        title="No trips match"
        description="Adjust filters or create a new itinerary."
      />
    );
  }
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {trips.map((trip, i) => (
        <motion.div
          key={trip._id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
        >
          <TripCard trip={trip} stagger={i} onDelete={onDelete} />
        </motion.div>
      ))}
    </div>
  );
}
