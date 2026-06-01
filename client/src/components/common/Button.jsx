import { cn } from '../../utils/helpers.js';

export default function Button({
  children,
  className,
  variant = 'primary',
  type = 'button',
  disabled,
  ...props
}) {
  const variants = {
    primary:
      'bg-primary text-white font-semibold hover:brightness-110 active:scale-[0.97] shadow-md',
    premium:
      'bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow-glow-sm hover:brightness-110 active:scale-[0.97]',
    outline:
      'border-2 border-primary text-primary-dark bg-white hover:bg-teal-50 active:scale-[0.97]',
    ghost: 'text-dark hover:bg-slate-100 active:scale-[0.97]',
    danger: 'bg-error text-white hover:bg-red-600 active:scale-[0.97]',
  };
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'rounded-xl px-4 py-3 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:pointer-events-none min-h-[44px]',
        variants[variant] || variants.primary,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
