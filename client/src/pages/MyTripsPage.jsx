import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Input from '../components/common/Input.jsx';
import TripList from '../components/trips/TripList.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';
import * as tripService from '../services/tripService.js';
import { debounce } from '../utils/helpers.js';

export default function MyTripsPage() {
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('status') || 'all';
  const sort = searchParams.get('sort') || 'createdAt';
  const [search, setSearch] = useState('');
  const [del, setDel] = useState(null);

  const debouncedSetSearch = useMemo(() => debounce((v) => setSearch(v), 300), []);

  const tripsQ = useQuery({
    queryKey: ['trips', { status: filter, sort }],
    queryFn: () => tripService.fetchTrips({ status: filter, sort }),
  });

  const filtered = useMemo(() => {
    let list = tripsQ.data?.trips || [];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q));
    }
    return list;
  }, [tripsQ.data, search]);

  const remove = async () => {
    if (!del) return;
    try {
      await tripService.deleteTrip(del._id);
      toast.success('Deleted');
      qc.invalidateQueries({ queryKey: ['trips'] });
    } catch (e) {
      toast.error(e.friendlyMessage || 'Failed');
    } finally {
      setDel(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My trips</h1>
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
        <Input
          placeholder="Search trips..."
          onChange={(e) => debouncedSetSearch(e.target.value)}
          className="max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          {['all', 'upcoming', 'ongoing', 'completed'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                const p = new URLSearchParams(searchParams);
                p.set('status', s);
                setSearchParams(p);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize min-h-[44px] transition-all ${
                filter === s
                  ? 'bg-primary text-navy font-semibold'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 items-center text-sm">
        <span className="text-muted">Sort:</span>
        {[
          { id: 'createdAt', label: 'Date created' },
          { id: 'startDate', label: 'Start date' },
          { id: 'name', label: 'Name' },
        ].map((o) => (
          <button
            key={o.id}
            type="button"
            className={`underline-offset-2 ${
              sort === o.id ? 'text-primary-dark font-semibold' : 'text-slate-500'
            }`}
            onClick={() => {
              const p = new URLSearchParams(searchParams);
              p.set('sort', o.id);
              setSearchParams(p);
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      <TripList trips={filtered} loading={tripsQ.isLoading} onDelete={setDel} />
      <Modal
        open={Boolean(del)}
        onClose={() => setDel(null)}
        title="Delete trip?"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDel(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={remove}>
              Delete
            </Button>
          </div>
        }
      >
        <p>Delete {del?.title}?</p>
      </Modal>
    </motion.div>
  );
}
