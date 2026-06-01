import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Share2 } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import Avatar from '../components/common/Avatar.jsx';
import * as communityService from '../services/communityService.js';
import * as tripService from '../services/tripService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDateRange, getTripDays } from '../utils/helpers.js';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';

export default function CommunityPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState('recent');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['community', tab, search],
    queryFn: () =>
      communityService.fetchCommunityTrips({ sort: tab === 'popular' ? 'popular' : 'recent', search }),
  });

  const copyTrip = async (id) => {
    if (!user) {
      toast.info('Please login to copy a trip');
      navigate('/login');
      return;
    }
    try {
      const { trip } = await tripService.duplicateTrip(id);
      toast.success('Trip copied to your account');
      qc.invalidateQueries({ queryKey: ['trips'] });
      navigate(`/trips/${trip._id}/builder`);
    } catch (e) {
      toast.error(e.friendlyMessage || 'Could not copy');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community trips</h1>
          <p className="text-muted mt-1">Discover public itineraries from fellow travelers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={tab === 'recent' ? 'primary' : 'outline'} type="button" onClick={() => setTab('recent')}>
            Most recent
          </Button>
          <Button
            variant={tab === 'popular' ? 'primary' : 'outline'}
            type="button"
            onClick={() => setTab('popular')}
          >
            Most popular
          </Button>
        </div>
      </div>
      <Input placeholder="Search titles..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
      {isLoading ? (
        <p className="text-muted">Loading feed…</p>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {(data?.trips || []).map((trip, i) => (
            <motion.div
              key={trip._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="aspect-video relative">
                  {trip.coverPhoto ? (
                    <img src={trip.coverPhoto} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-200 to-slate-200" />
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg line-clamp-2">{trip.title}</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted">
                    <Avatar src={trip.userId?.photo} name={trip.userId?.name} size="sm" />
                    <span>{trip.userId?.name}</span>
                  </div>
                  <p className="text-xs text-muted mt-2 line-clamp-2">
                    {(trip.stops || []).map((s) => s.cityName).join(' → ')}
                  </p>
                  <p className="text-sm mt-2">
                    {formatDateRange(trip.startDate, trip.endDate)} · {getTripDays(trip.startDate, trip.endDate)} days
                  </p>
                  <div className="flex items-center justify-between mt-4 text-sm text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Heart className="w-4 h-4" /> {trip.likes}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Bookmark className="w-4 h-4" /> {trip.saves}
                    </span>
                    <span className="text-primary-dark font-semibold">
                      ${trip.totalBudget || 0} budget
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (trip.publicSlug) {
                          const url = `${window.location.origin}/share/${trip.publicSlug}`;
                          navigator.clipboard.writeText(url);
                          toast.info('Link copied');
                        }
                      }}
                    >
                      <Share2 className="w-4 h-4 inline mr-1" />
                      Copy link
                    </Button>
                    <Button type="button" onClick={() => copyTrip(trip._id)}>
                      Copy to my trips
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="col-span-2"
                      onClick={() => trip.publicSlug && navigate(`/share/${trip.publicSlug}`)}
                    >
                      View public page
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
