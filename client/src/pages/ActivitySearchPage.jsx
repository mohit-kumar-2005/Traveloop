import { useSearchParams } from 'react-router-dom';
import ActivitySearch from '../components/search/ActivitySearch.jsx';

export default function ActivitySearchPage() {
  const [params] = useSearchParams();
  const cityId = params.get('cityId');
  const tripId = params.get('tripId');
  const stopId = params.get('stopId');

  if (!cityId || !tripId || !stopId) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4">
        <h1 className="text-2xl font-bold mb-3">Activity search</h1>
        <p className="text-muted leading-relaxed">
          Pass query parameters <code className="text-sm bg-slate-100 px-2 py-1 rounded">cityId</code>,{' '}
          <code className="text-sm bg-slate-100 px-2 py-1 rounded">tripId</code>, and{' '}
          <code className="text-sm bg-slate-100 px-2 py-1 rounded">stopId</code> — for example from the
          itinerary builder&apos;s &quot;Open full search&quot; deep link.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Activities</h1>
      <ActivitySearch cityId={cityId} tripId={tripId} stopId={stopId} />
    </div>
  );
}
