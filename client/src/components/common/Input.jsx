import { cn } from '../../utils/helpers.js';

export default function Input({ label, error, className, id, variant = 'default', ...props }) {
  const inputId = id || props.name;
  const isGlass = variant === 'glass';

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium mb-1.5',
            isGlass ? 'text-slate-200' : 'text-slate-700'
          )}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-xl px-4 py-3 transition-all outline-none',
          isGlass
            ? 'border border-white/20 bg-white/10 text-white placeholder:text-slate-400 focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/30'
            : 'border border-slate-200 focus:ring-2 focus:ring-teal-400 focus:border-teal-400',
          error && 'border-red-400 animate-shake',
          className
        )}
        {...props}
      />
      {error && (
        <p className={cn('text-xs mt-1', isGlass ? 'text-red-300' : 'text-red-500')}>{error}</p>
      )}
    </div>
  );
}
