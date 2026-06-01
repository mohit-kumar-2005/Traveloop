import { cn } from '../../utils/helpers.js';

export default function Card({ children, className, onClick }) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => onClick && e.key === 'Enter' && onClick(e)}
      className={cn(
        'bg-white rounded-2xl shadow-md transition-all duration-200 ease-in-out',
        onClick && 'cursor-pointer hover:shadow-lg hover:scale-[1.02]',
        className
      )}
    >
      {children}
    </div>
  );
}
