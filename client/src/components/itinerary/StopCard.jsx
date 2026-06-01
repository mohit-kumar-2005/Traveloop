import DatePicker from 'react-datepicker';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, X } from 'lucide-react';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';

export default function StopCard({
  stop,
  tripId,
  onChangeDates,
  onBudget,
  onRemoveStop,
  onOpenActivities,
  onRemoveActivity,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stop._id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="overflow-hidden border border-slate-100">
        <div className="flex gap-3 p-4">
          <button
            type="button"
            className="text-muted hover:text-dark cursor-grab active:cursor-grabbing min-w-[44px] flex justify-center"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-6 h-6" />
          </button>
          <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
            {stop.cityId?.coverImage && (
              <img src={stop.cityId.coverImage} alt="" className="w-full h-full object-cover" loading="lazy" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between gap-2">
              <div>
                <h3 className="font-bold text-lg truncate">{stop.cityName}</h3>
                <p className="text-sm text-muted">{stop.country}</p>
              </div>
              <button type="button" className="text-error text-sm" onClick={() => onRemoveStop(stop._id)}>
                Remove stop
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-xs text-muted">Arrival</label>
                <DatePicker
                  selected={new Date(stop.arrivalDate)}
                  onChange={(d) => onChangeDates(stop._id, { arrivalDate: d })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted">Departure</label>
                <DatePicker
                  selected={new Date(stop.departureDate)}
                  onChange={(d) => onChangeDates(stop._id, { departureDate: d })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(stop.activities || []).map((a) => (
                <span
                  key={a._id}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-teal-50 text-xs text-teal-900"
                >
                  {a.name}
                  <button type="button" onClick={() => onRemoveActivity(stop._id, a._id)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <Button type="button" variant="outline" className="py-1 px-2 text-xs" onClick={() => onOpenActivities(stop)}>
                <Plus className="w-4 h-4 inline mr-1" />
                Add activity
              </Button>
            </div>
            <div className="mt-3">
              <label className="text-xs text-muted">Budget for this stop ($)</label>
              <input
                type="number"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                defaultValue={stop.stopBudget}
                onBlur={(e) => onBudget(stop._id, Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
