import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import WelcomeBanner from '../components/dashboard/WelcomeBanner.jsx';
import TripCard from '../components/dashboard/TripCard.jsx';
import RecommendedCities from '../components/dashboard/RecommendedCities.jsx';
import BudgetHighlight from '../components/dashboard/BudgetHighlight.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Loader from '../components/common/Loader.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import * as tripService from '../services/tripService.js';
import * as cityService from '../services/cityService.js';
import * as budgetService from '../services/budgetService.js';
import { useState } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [deleteTrip, setDeleteTrip] = useState(null);

  const tripsQ = useQuery({
    queryKey: ['trips', {}],
    queryFn: () => tripService.fetchTrips({}),
  });

  const citiesQ = useQuery({
    queryKey: ['popular-cities'],
    queryFn: cityService.fetchPopularCities,
  });

  const trips = tripsQ.data?.trips || [];
  const ongoing = trips.find((t) => t.status === 'ongoing') || trips[0];

  const budgetQ = useQuery({
    queryKey: ['budget', ongoing?._id],
    queryFn: () => budgetService.fetchBudget(ongoing._id),
    enabled: Boolean(ongoing?._id),
  });

  const confirmDelete = async () => {
    if (!deleteTrip) return;
    try {
      await tripService.deleteTrip(deleteTrip._id);
      toast.success('Trip deleted');
      qc.invalidateQueries({ queryKey: ['trips'] });
    } catch (e) {
      toast.error(e.friendlyMessage || 'Could not delete');
    } finally {
      setDeleteTrip(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <WelcomeBanner name={user?.name} />

      <section>
        <h2 className="text-xl font-bold tracking-tight mb-4">Popular destinations</h2>
        <RecommendedCities cities={citiesQ.data?.cities} loading={citiesQ.isLoading} />
      </section>

      <section className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Previous trips</h2>
          </div>
          {tripsQ.isLoading ? (
            <Loader />
          ) : trips.length === 0 ? (
            <EmptyState
              title="No trips yet"
              description="Start planning your first adventure with Traveloop."
            />
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {trips.slice(0, 6).map((trip, i) => (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <TripCard trip={trip} stagger={i} onDelete={setDeleteTrip} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <div>
          {ongoing && budgetQ.data?.budget && (
            <BudgetHighlight trip={ongoing} budget={budgetQ.data.budget} />
          )}
        </div>
      </section>

      <Modal
        open={Boolean(deleteTrip)}
        onClose={() => setDeleteTrip(null)}
        title="Delete trip?"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteTrip(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Confirm delete
            </Button>
          </div>
        }
      >
        <p className="text-slate-600">
          This will permanently delete <strong>{deleteTrip?.title}</strong> and related stops.
        </p>
      </Modal>
    </motion.div>
  );
}
