import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import TripForm from '../components/trips/TripForm.jsx';
import Card from '../components/common/Card.jsx';
import * as tripService from '../services/tripService.js';

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async (payload) => {
    setLoading(true);
    try {
      const { trip } = await tripService.createTrip({
        title: payload.title,
        description: payload.description,
        startDate: payload.startDate,
        endDate: payload.endDate,
        coverPhoto: payload.coverPhoto,
        isPublic: payload.isPublic,
        totalBudget: 0,
      });
      if (payload.destinationCityId) {
        await tripService.addStop(trip._id, {
          cityId: payload.destinationCityId,
          arrivalDate: payload.startDate,
          departureDate: payload.endDate,
        });
      }
      localStorage.removeItem('traveloop-trip-draft');
      toast.success('Trip created');
      navigate(`/trips/${trip._id}/builder`, { replace: true });
    } catch (e) {
      toast.error(e.friendlyMessage || 'Could not create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <div className="flex gap-2 mb-8 text-sm font-medium text-muted">
        <span className="text-primary-dark">① Trip Details</span>
        <span>→</span>
        <span>② Stops</span>
        <span>→</span>
        <span>③ Budget</span>
      </div>
      <Card className="p-8">
        <h1 className="text-2xl font-bold mb-6 tracking-tight">Create a trip</h1>
        <TripForm onSubmit={handleCreate} submitting={loading} />
      </Card>
    </motion.div>
  );
}
