import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import StopCard from './StopCard.jsx';
import TripMap from './TripMap.jsx';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import CitySearch from '../search/CitySearch.jsx';
import ActivitySearch from '../search/ActivitySearch.jsx';
import * as tripService from '../../services/tripService.js';
import { getTripDays } from '../../utils/helpers.js';

export default function ItineraryBuilder({
  trip,
  onRefresh,
}) {
  const stops = useMemo(
    () => [...(trip?.stops || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [trip]
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const [cityOpen, setCityOpen] = useState(false);
  const [activityCtx, setActivityCtx] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setSavedFlash(true);
    const t = setTimeout(() => setSavedFlash(false), 1200);
    return () => clearTimeout(t);
  }, [trip]);

  const tripDays = getTripDays(trip?.startDate, trip?.endDate);

  const onDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const ids = stops.map((s) => s._id);
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    const next = arrayMove(ids, oldIndex, newIndex);
    try {
      await tripService.reorderStops(trip._id, next);
      toast.success('Order updated');
      onRefresh();
    } catch (e) {
      toast.error(e.friendlyMessage || 'Reorder failed');
    }
  };

  const handleDates = async (stopId, payload) => {
    try {
      await tripService.updateStop(trip._id, stopId, payload);
      onRefresh();
    } catch (e) {
      toast.error(e.friendlyMessage || 'Update failed');
    }
  };

  const handleBudget = async (stopId, val) => {
    try {
      await tripService.updateStop(trip._id, stopId, { stopBudget: val });
      onRefresh();
    } catch (e) {
      toast.error(e.friendlyMessage || 'Update failed');
    }
  };

  const addCity = async (city) => {
    try {
      await tripService.addStop(trip._id, {
        cityId: city._id,
        arrivalDate: trip.startDate,
        departureDate: trip.endDate,
      });
      setCityOpen(false);
      toast.success('Stop added');
      onRefresh();
    } catch (e) {
      toast.error(e.friendlyMessage || 'Could not add stop');
    }
  };

  const removeStop = async (stopId) => {
    try {
      await tripService.deleteStop(trip._id, stopId);
      toast.success('Stop removed');
      onRefresh();
    } catch (e) {
      toast.error(e.friendlyMessage || 'Could not remove');
    }
  };

  const removeActivity = async (stopId, actId) => {
    try {
      await tripService.removeActivityFromStop(trip._id, stopId, actId);
      onRefresh();
    } catch (e) {
      toast.error(e.friendlyMessage || 'Could not remove activity');
    }
  };

  return (
    <div className="grid xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted">
              {tripDays} days · {stops.length} stops
            </p>
            <div className="h-2 mt-2 rounded-full bg-slate-100 overflow-hidden max-w-md">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min(100, (stops.length / Math.max(1, tripDays)) * 100)}%` }}
              />
            </div>
          </div>
          <span
            className={`text-sm font-medium transition-opacity ${
              savedFlash ? 'text-success opacity-100' : 'opacity-0'
            }`}
          >
            Saved
          </span>
        </div>

        <Button type="button" onClick={() => setCityOpen(true)} className="w-full sm:w-auto">
          Add stop
        </Button>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={stops.map((s) => s._id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {stops.map((s) => (
                <StopCard
                  key={s._id}
                  stop={s}
                  tripId={trip._id}
                  onChangeDates={(id, payload) => handleDates(id, payload)}
                  onBudget={handleBudget}
                  onRemoveStop={removeStop}
                  onOpenActivities={(stop) => setActivityCtx(stop)}
                  onRemoveActivity={removeActivity}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button
          type="button"
          className="fixed bottom-24 lg:bottom-10 right-6 z-30 px-6 py-4 rounded-full bg-primary text-navy font-semibold shadow-lg hover:brightness-110 transition-all active:scale-[0.97]"
          onClick={() => setCityOpen(true)}
        >
          + Add another stop
        </button>
      </div>

      <div className="hidden xl:block">
        <TripMap stops={stops} />
      </div>

      <Modal open={cityOpen} onClose={() => setCityOpen(false)} title="Add city stop">
        <CitySearch onPickCity={addCity} />
      </Modal>

      <Modal
        open={Boolean(activityCtx)}
        onClose={() => setActivityCtx(null)}
        title="Add activities"
      >
        {activityCtx && (
          <ActivitySearch
            cityId={activityCtx.cityId?._id || activityCtx.cityId}
            tripId={trip._id}
            stopId={activityCtx._id}
            onAdded={() => {
              setActivityCtx(null);
              onRefresh();
            }}
          />
        )}
      </Modal>
    </div>
  );
}
