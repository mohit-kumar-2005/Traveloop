import { Link } from 'react-router-dom';
import { Calendar, MapPin, Pencil, Trash2, Eye } from 'lucide-react';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import { formatDateRange } from '../../utils/helpers.js';

const statusVariant = {
  upcoming: 'warning',
  ongoing: 'teal',
  completed: 'success',
};

export default function TripCard({ trip, onDelete, stagger }) {
  const destCount = trip.stops?.length ?? 0;
  return (
    <Card className="overflow-hidden group">
      <div className="aspect-video bg-slate-200 relative">
        {trip.coverPhoto ? (
          <img
            src={trip.coverPhoto}
            alt=""
            className="w-full h-full object-cover rounded-t-2xl"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-200 to-slate-300 rounded-t-2xl" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent rounded-t-2xl" />
        <Badge variant={statusVariant[trip.status] || 'default'} className="absolute top-3 right-3 capitalize">
          {trip.status}
        </Badge>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg text-dark line-clamp-1">{trip.title}</h3>
        <div className="flex flex-wrap gap-3 text-sm text-muted mt-2">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDateRange(trip.startDate, trip.endDate)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {destCount} stops
          </span>
        </div>
        <div className="flex gap-2 mt-4">
          <Link
            to={`/trips/${trip._id}/view`}
            className="flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50 min-h-[44px]"
          >
            <Eye className="w-4 h-4" /> View
          </Link>
          <Link
            to={`/trips/${trip._id}/builder`}
            className="flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-xl bg-primary/15 text-primary-dark text-sm font-medium hover:bg-primary/25 min-h-[44px]"
          >
            <Pencil className="w-4 h-4" /> Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete?.(trip)}
            className="px-3 rounded-xl border border-red-100 text-error hover:bg-red-50 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}
