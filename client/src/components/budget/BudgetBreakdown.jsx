import Input from '../common/Input.jsx';

export default function BudgetBreakdown({
  values,
  onChange,
  costPerPersonMultiplier,
  onMultiplierChange,
}) {
  const fields = [
    { key: 'transport', label: 'Transport' },
    { key: 'accommodation', label: 'Accommodation' },
    { key: 'activities', label: 'Activities' },
    { key: 'meals', label: 'Meals' },
    { key: 'miscellaneous', label: 'Miscellaneous' },
  ];
  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">$</span>
            <input
              type="number"
              min={0}
              className="w-full border border-slate-200 rounded-xl pl-8 pr-4 py-3 outline-none focus:ring-2 focus:ring-teal-400"
              value={values[f.key] ?? 0}
              onChange={(e) => onChange(f.key, Number(e.target.value))}
            />
          </div>
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Daily limit</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">$</span>
          <input
            type="number"
            min={0}
            className="w-full border border-slate-200 rounded-xl pl-8 pr-4 py-3 outline-none focus:ring-2 focus:ring-teal-400"
            value={values.dailyLimit ?? 0}
            onChange={(e) => onChange('dailyLimit', Number(e.target.value))}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Cost per person multiplier</label>
        <input
          type="number"
          step={0.1}
          min={0.1}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-400"
          value={costPerPersonMultiplier}
          onChange={(e) => onMultiplierChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
