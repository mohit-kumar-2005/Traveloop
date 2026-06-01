import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import * as checklistService from '../services/checklistService.js';
import { CHECKLIST_CATEGORIES } from '../utils/constants.js';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Card from '../components/common/Card.jsx';
import Loader from '../components/common/Loader.jsx';
import Modal from '../components/common/Modal.jsx';
import { useState } from 'react';

export default function PackingChecklistPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState('other');
  const [resetOpen, setResetOpen] = useState(false);

  const q = useQuery({
    queryKey: ['checklist', id],
    queryFn: () => checklistService.fetchChecklist(id),
    enabled: Boolean(id),
  });

  const items = q.data?.items || [];

  const addItem = useMutation({
    mutationFn: () => checklistService.addChecklistItem(id, { label, category }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['checklist', id] });
      setLabel('');
      toast.success('Item added');
    },
  });

  const toggle = useMutation({
    mutationFn: ({ itemId, isPacked }) =>
      checklistService.updateChecklistItem(id, itemId, { isPacked }),
    onMutate: async ({ itemId, isPacked }) => {
      await qc.cancelQueries({ queryKey: ['checklist', id] });
      const prev = qc.getQueryData(['checklist', id]);
      qc.setQueryData(['checklist', id], (old) => ({
        ...old,
        items: (old?.items || []).map((it) =>
          it._id === itemId ? { ...it, isPacked } : it
        ),
      }));
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      qc.setQueryData(['checklist', id], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['checklist', id] }),
  });

  const removeItem = useMutation({
    mutationFn: (itemId) => checklistService.deleteChecklistItem(id, itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['checklist', id] }),
  });

  const packed = items.filter((i) => i.isPacked).length;

  const grouped = CHECKLIST_CATEGORIES.map((cat) => ({
    ...cat,
    items: items.filter((i) => i.category === cat.id),
  }));

  const resetAll = async () => {
    await Promise.all(items.map((i) => checklistService.updateChecklistItem(id, i._id, { isPacked: false })));
    qc.invalidateQueries({ queryKey: ['checklist', id] });
    setResetOpen(false);
    toast.success('Checklist reset');
  };

  if (q.isLoading) return <Loader />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-wrap justify-between gap-4 items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Packing checklist</h1>
          <p className="text-muted mt-1">
            {packed} of {items.length} items packed
          </p>
        </div>
        <Button variant="outline" onClick={() => setResetOpen(true)}>
          Reset all
        </Button>
      </div>

      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${items.length ? (packed / items.length) * 100 : 0}%` }}
        />
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="New item..."
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="flex-1"
          />
          <select
            className="border border-slate-200 rounded-xl px-4 py-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CHECKLIST_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
          <Button type="button" onClick={() => label.trim() && addItem.mutate()} className="sm:w-40">
            Add item
          </Button>
        </div>
      </Card>

      <div className="space-y-6">
        {grouped.map((g) => (
          <Card key={g.id} className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">
                {g.emoji} {g.label}
              </h3>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  className="underline text-primary-dark"
                  onClick={() =>
                    g.items.forEach((it) => toggle.mutate({ itemId: it._id, isPacked: true }))
                  }
                >
                  Check all
                </button>
                <button
                  type="button"
                  className="underline text-muted"
                  onClick={() =>
                    g.items.forEach((it) => toggle.mutate({ itemId: it._id, isPacked: false }))
                  }
                >
                  Uncheck all
                </button>
              </div>
            </div>
            <ul className="space-y-2">
              {g.items.map((it) => (
                <li key={it._id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                  <input
                    type="checkbox"
                    checked={it.isPacked}
                    onChange={(e) =>
                      toggle.mutate({ itemId: it._id, isPacked: e.target.checked })
                    }
                    className="w-5 h-5 accent-primary"
                  />
                  <span
                    className={`flex-1 transition-all ${
                      it.isPacked ? 'line-through text-muted' : 'text-dark'
                    }`}
                  >
                    {it.label}
                  </span>
                  <button
                    type="button"
                    className="text-error text-sm"
                    onClick={() => removeItem.mutate(it._id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
              {g.items.length === 0 && (
                <p className="text-sm text-muted">No items in this category yet.</p>
              )}
            </ul>
          </Card>
        ))}
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset checklist?"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={resetAll}>
              Reset
            </Button>
          </div>
        }
      >
        <p>This will uncheck every item.</p>
      </Modal>
    </motion.div>
  );
}
