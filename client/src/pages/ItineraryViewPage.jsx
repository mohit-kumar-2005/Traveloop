import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  CalendarRange,
  Map as MapIcon,
  Share2,
  Printer,
  Copy,
  Pencil,
} from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Loader from '../components/common/Loader.jsx';
import TripMap from '../components/itinerary/TripMap.jsx';
import * as tripService from '../services/tripService.js';
import {
  eachDayBetween,
  formatDateRange,
  getTripDays,
} from '../utils/helpers.js';
import { toast } from 'react-toastify';

export default function ItineraryViewPage() {
  const { id } = useParams();
  const [tab, setTab] = useState('timeline');

  const q = useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripService.fetchTrip(id),
    enabled: Boolean(id),
  });

  const trip = q.data?.trip;

  const days = useMemo(() => {
    if (!trip) return [];
    return eachDayBetween(trip.startDate, trip.endDate);
  }, [trip]);

  const calendarDots = useMemo(() => {
    const map = {};
    (trip?.stops || []).forEach((stop) => {
      eachDayBetween(stop.arrivalDate, stop.departureDate).forEach((d) => {
        const key = d.toDateString();
        map[key] = (map[key] || 0) + (stop.activities?.length || 0);
      });
    });
    return map;
  }, [trip]);

  const share = () => {
    if (trip?.publicSlug) {
      const url = `${window.location.origin}/share/${trip.publicSlug}`;
      navigator.clipboard.writeText(url);
      toast.info('Public link copied');
    } else {
      toast.info('Mark trip as public to share a link from the trip editor.');
    }
  };

  if (q.isLoading || !trip) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{trip.title}</h1>
          <p className="text-muted mt-1">
            {formatDateRange(trip.startDate, trip.endDate)} · {getTripDays(trip.startDate, trip.endDate)} days
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={share}>
            <Share2 className="w-4 h-4 inline mr-2" />
            Share
          </Button>
          <Button type="button" variant="outline" onClick={() => window.print()}>
            <Printer className="w-4 h-4 inline mr-2" />
            Print / PDF
          </Button>
          <Link to={`/trips/${trip._id}/builder`}>
            <Button type="button">
              <Pencil className="w-4 h-4 inline mr-2" />
              Edit itinerary
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'timeline', label: 'Timeline', icon: CalendarRange },
          { id: 'calendar', label: 'Calendar', icon: CalendarDays },
          { id: 'map', label: 'Map', icon: MapIcon },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold min-h-[44px] transition-all ${
              tab === t.id ? 'bg-teal-50 text-primary-dark border border-teal-100' : 'text-muted hover:text-dark'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {tab === 'timeline' && (
            <div className="space-y-6">
              {(trip.stops || []).map((stop, idx) => (
                <motion.div
                  key={stop._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                >
                  <div
                    className="h-32 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${stop.cityId?.coverImage || ''})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
                    <div className="absolute bottom-3 left-4 text-white font-bold text-xl">
                      {stop.cityName} · {stop.country}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    {(stop.activities || []).map((a) => (
                      <div
                        key={a._id}
                        className="flex justify-between gap-4 border border-slate-100 rounded-xl px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold">{a.name}</p>
                          <p className="text-xs text-muted capitalize">{a.category}</p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-semibold text-primary-dark">${a.estimatedCost}</p>
                          <p className="text-muted">{a.duration}h</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {tab === 'calendar' && (
            <div className="bg-white rounded-2xl shadow-md p-4">
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {days.map((d) => {
                  const key = d.toDateString();
                  const count = calendarDots[key] || 0;
                  return (
                    <div key={key} className="aspect-square rounded-xl border border-slate-100 flex flex-col items-center justify-center text-xs">
                      <span className="font-semibold">{d.getDate()}</span>
                      {count > 0 && (
                        <span className="mt-1 w-2 h-2 rounded-full bg-primary" title={`${count} activities`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'map' && (
            <div className="bg-white rounded-2xl shadow-md p-4">
              <TripMap stops={trip.stops || []} />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
            <p className="text-sm text-muted">Trip budget</p>
            <p className="text-4xl font-bold text-primary-dark mt-2">${trip.totalBudget || 0}</p>
            <p className="text-xs text-muted mt-2">
              Daily avg ~ $
              {(
                (trip.totalBudget || 0) / Math.max(1, getTripDays(trip.startDate, trip.endDate))
              ).toFixed(0)}
            </p>
            <Button type="button" className="w-full mt-4" variant="outline" onClick={share}>
              <Copy className="w-4 h-4 inline mr-2" />
              Copy share link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
