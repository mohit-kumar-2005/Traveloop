import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Copy, Printer, Facebook, Twitter } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Loader from '../components/common/Loader.jsx';
import TripMap from '../components/itinerary/TripMap.jsx';
import * as tripService from '../services/tripService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDateRange } from '../utils/helpers.js';

export default function PublicItineraryPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const q = useQuery({
    queryKey: ['public-trip', slug],
    queryFn: () => tripService.fetchPublicTripBySlug(slug),
    enabled: Boolean(slug),
  });

  const trip = q.data?.trip;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info('Link copied');
  };

  const copyTrip = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const { trip: t } = await tripService.duplicateTrip(trip._id);
      toast.success('Added to your trips');
      navigate(`/trips/${t._id}/builder`);
    } catch (e) {
      toast.error(e.friendlyMessage || 'Could not copy trip');
    }
  };

  if (q.isLoading) return <Loader />;
  if (!trip) return <p className="p-8">Itinerary not found.</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-6 pb-16">
      <div
        className="rounded-2xl h-56 bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url(${trip.coverPhoto || ''})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-dark/20" />
        <div className="absolute bottom-0 left-0 p-6 text-white space-y-2">
          <p className="text-sm text-teal-100">
            Shared by {trip.userId?.name} · {formatDateRange(trip.startDate, trip.endDate)}
          </p>
          <h1 className="text-3xl font-bold tracking-tight">{trip.title}</h1>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={copyLink}>
          <Copy className="w-4 h-4 inline mr-2" />
          Copy link
        </Button>
        <a
          className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold inline-flex items-center gap-2 min-h-[44px]"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(trip.title)}&url=${encodeURIComponent(
            window.location.href
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          <Twitter className="w-4 h-4" /> Tweet
        </a>
        <a
          className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold inline-flex items-center gap-2 min-h-[44px]"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noreferrer"
        >
          <Facebook className="w-4 h-4" /> Share
        </a>
        <Button type="button" variant="outline" onClick={() => window.print()}>
          <Printer className="w-4 h-4 inline mr-2" />
          Print / PDF
        </Button>
        {user && (
          <Link to={`/trips/${trip._id}/builder`} className="hidden" />
        )}
        <Button type="button" onClick={copyTrip}>
          Copy this trip to my trips
        </Button>
        {user && (
          <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')}>
            Back home
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          {(trip.stops || []).map((stop) => (
            <div key={stop._id} className="bg-white rounded-2xl shadow-md p-5">
              <div className="flex gap-4">
                <div className="w-28 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  {stop.cityId?.coverImage && (
                    <img src={stop.cityId.coverImage} alt="" className="w-full h-full object-cover" loading="lazy" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xl">
                    {stop.cityName}, {stop.country}
                  </h3>
                  <p className="text-sm text-muted">
                    {formatDateRange(stop.arrivalDate, stop.departureDate)}
                  </p>
                  <ul className="mt-3 space-y-1 text-sm">
                    {(stop.activities || []).map((a) => (
                      <li key={a._id}>
                        • {a.name}{' '}
                        <span className="text-primary-dark font-semibold">${a.estimatedCost}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-md p-5 sticky top-24">
            <p className="text-sm text-muted">Total budget</p>
            <p className="text-3xl font-bold text-primary-dark">${trip.totalBudget || 0}</p>
          </div>
          <TripMap stops={trip.stops || []} />
        </div>
      </div>
    </motion.div>
  );
}
