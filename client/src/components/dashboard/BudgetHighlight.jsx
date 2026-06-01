import Card from '../common/Card.jsx';

export default function BudgetHighlight({ trip, budget }) {
  if (!trip || !budget) return null;
  const total =
    budget.transport +
    budget.accommodation +
    budget.activities +
    budget.meals +
    budget.miscellaneous;
  const spent = total * 0.62;
  const pct = total ? Math.min(100, Math.round((spent / total) * 100)) : 0;
  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-2">Budget pulse — {trip.title}</h3>
      <p className="text-sm text-muted mb-4">Estimated spend vs planned budget</p>
      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-3 text-sm">
        <span className="text-muted">Spent (est.)</span>
        <span className="font-semibold">${spent.toFixed(0)}</span>
      </div>
      <div className="flex justify-between mt-1 text-sm">
        <span className="text-muted">Budget</span>
        <span className="font-semibold">${total.toFixed(0)}</span>
      </div>
    </Card>
  );
}
