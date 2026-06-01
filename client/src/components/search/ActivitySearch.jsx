import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as activityService from '../../services/activityService.js';
import * as tripService from '../../services/tripService.js';
import Button from '../common/Button.jsx';
import { toast } from 'react-toastify';
import { ACTIVITY_CATEGORIES } from '../../utils/constants.js';

export default function ActivitySearch({ cityId, tripId, stopId, onAdded }) {
  const [category, setCategory] = useState('');
  const [maxCost, setMaxCost] = useState(500);
  const [maxDuration, setMaxDuration] = useState(12);
  const [selected, setSelected] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ['activities', cityId, category, maxCost, maxDuration],
    queryFn: () =>
      activityService.fetchActivities({
        cityId,
        category: category || undefined,
        maxCost,
        maxDuration,
      }),
    enabled: Boolean(cityId),
  });

  const activities = data?.activities || [];

  const toggle = (a) => {
    setSelected((prev) =>
      prev.some((x) => x._id === a._id) ? prev.filter((x) => x._id !== a._id) : [...prev, a]
    );
  };

  const total = useMemo(
    () => selected.reduce((s, a) => s + (a.estimatedCost || 0), 0),
    [selected]
  );

  const confirm = async () => {
    try {
      for (const a of selected) {
        await tripService.addActivityToStop(tripId, stopId, a._id);
      }
      toast.success('Activities added');
      onAdded?.();
    } catch (e) {
      toast.error(e.friendlyMessage || 'Could not add activities');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted">Category</label>
          <select
            className="w-full border rounded-xl px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            {ACTIVITY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted">Max cost ($)</label>
          <input
            type="range"
            min={0}
            max={1000}
            value={maxCost}
            onChange={(e) => setMaxCost(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-right">${maxCost}</p>
        </div>
        <div>
          <label className="text-xs text-muted">Max duration (h)</label>
          <input
            type="range"
            min={1}
            max={24}
            value={maxDuration}
            onChange={(e) => setMaxDuration(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-right">{maxDuration}h</p>
        </div>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {isLoading && <p className="text-sm text-muted">Loading…</p>}
        {!isLoading &&
          activities.map((a) => (
            <button
              type="button"
              key={a._id}
              onClick={() => toggle(a)}
              className={`w-full text-left border rounded-xl p-3 transition-all ${
                selected.some((x) => x._id === a._id)
                  ? 'border-primary bg-teal-50'
                  : 'border-slate-200 hover:border-primary/50'
              }`}
            >
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  {a.image && <img src={a.image} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{a.name}</p>
                  <p className="text-xs text-muted capitalize">{a.category}</p>
                  <p className="text-xs mt-1 line-clamp-2">{a.description}</p>
                  <div className="flex gap-3 mt-2 text-xs font-medium">
                    <span className="text-primary-dark">${a.estimatedCost}</span>
                    <span>{a.duration}h</span>
                    <span>★ {a.rating}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
      </div>
      <div className="sticky bottom-0 bg-white border-t pt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm">
          Selected total: <strong>${total.toFixed(0)}</strong>
        </div>
        <Button type="button" onClick={confirm} disabled={!selected.length}>
          Confirm selection
        </Button>
      </div>
    </div>
  );
}
