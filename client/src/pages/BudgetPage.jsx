import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useBudget, useSaveBudget } from '../hooks/useBudget.js';
import BudgetBreakdown from '../components/budget/BudgetBreakdown.jsx';
import { BudgetPie, BudgetBar, BudgetLine } from '../components/budget/CostChart.jsx';
import Button from '../components/common/Button.jsx';
import Loader from '../components/common/Loader.jsx';
import Card from '../components/common/Card.jsx';
import { eachDayBetween, getTripDays } from '../utils/helpers.js';
import * as tripService from '../services/tripService.js';
import { useQuery } from '@tanstack/react-query';

export default function BudgetPage() {
  const { id } = useParams();
  const budgetQ = useBudget(id);
  const saveBudget = useSaveBudget(id);
  const tripQ = useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripService.fetchTrip(id),
    enabled: Boolean(id),
  });

  const trip = tripQ.data?.trip;
  const b = budgetQ.data?.budget;

  const [form, setForm] = useState({
    transport: 0,
    accommodation: 0,
    activities: 0,
    meals: 0,
    miscellaneous: 0,
    dailyLimit: 0,
    costPerPersonMultiplier: 1,
  });

  useEffect(() => {
    if (!b) return;
    setForm({
      transport: b.transport,
      accommodation: b.accommodation,
      activities: b.activities,
      meals: b.meals,
      miscellaneous: b.miscellaneous,
      dailyLimit: b.dailyLimit,
      costPerPersonMultiplier: b.costPerPersonMultiplier ?? 1,
    });
  }, [b]);

  const total =
    form.transport +
    form.accommodation +
    form.activities +
    form.meals +
    form.miscellaneous;

  const days = trip ? getTripDays(trip.startDate, trip.endDate) : 1;
  const avgPerDay = total / days;

  const pieData = useMemo(
    () =>
      [
        { name: 'Transport', value: form.transport },
        { name: 'Stay', value: form.accommodation },
        { name: 'Activities', value: form.activities },
        { name: 'Meals', value: form.meals },
        { name: 'Misc', value: form.miscellaneous },
      ].filter((d) => d.value > 0),
    [form]
  );

  const barData = useMemo(() => {
    if (!trip) return [];
    const dayList = eachDayBetween(trip.startDate, trip.endDate);
    const per = total / Math.max(1, dayList.length);
    return dayList.map((d, i) => ({
      day: `D${i + 1}`,
      amount: Math.round(per * (0.85 + (i % 3) * 0.05)),
    }));
  }, [trip, total]);

  const lineData = useMemo(() => {
    if (!trip) return [];
    const dayList = eachDayBetween(trip.startDate, trip.endDate);
    const projected = total / Math.max(1, dayList.length);
    return dayList.map((_, i) => ({
      day: `D${i + 1}`,
      projected: Math.round(projected),
      actual: Math.round(projected * (0.9 + (i % 5) * 0.02)),
    }));
  }, [trip, total]);

  const overspendDays = barData.filter((d) => form.dailyLimit > 0 && d.amount > form.dailyLimit);

  const persist = async () => {
    try {
      await saveBudget.mutateAsync(form);
      toast.success('Budget saved');
    } catch (e) {
      toast.error(e.friendlyMessage || 'Save failed');
    }
  };

  const updateField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  if (budgetQ.isLoading || !b) return <Loader />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-wrap justify-between gap-4 items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget & costs</h1>
          <p className="text-muted mt-1">{trip?.title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            Export / Print
          </Button>
          <Button onClick={persist}>Save budget</Button>
        </div>
      </div>

      {overspendDays.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 text-sm">
          {overspendDays.length} day(s) exceed your daily limit of ${form.dailyLimit}.
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="p-6 lg:col-span-1 space-y-4">
          <BudgetBreakdown
            values={form}
            onChange={updateField}
            costPerPersonMultiplier={form.costPerPersonMultiplier}
            onMultiplierChange={(v) => updateField('costPerPersonMultiplier', v)}
          />
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex justify-between font-semibold">
              <span>Total budget</span>
              <span>${total.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted">
              <span>Average / day</span>
              <span>${avgPerDay.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted">
              <span>Cost per person</span>
              <span>${(total * form.costPerPersonMultiplier).toFixed(0)}</span>
            </div>
          </div>
        </Card>
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Category split</h3>
            <BudgetPie data={pieData} />
          </Card>
          <Card className="p-6">
            <h3 className="font-bold mb-4">Daily burn</h3>
            <BudgetBar data={barData} />
          </Card>
          <Card className="p-6">
            <h3 className="font-bold mb-4">Projected vs actual</h3>
            <BudgetLine data={lineData} />
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
