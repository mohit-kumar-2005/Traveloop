import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MapPinned, Compass, Users, User } from 'lucide-react';

const items = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/trips', label: 'Trips', icon: MapPinned },
  { to: '/cities', label: 'Explore', icon: Compass },
  { to: '/community', label: 'Community', icon: Users },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="flex justify-around items-center py-2 px-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-xl transition-all ${
                isActive ? 'text-primary' : 'text-slate-400'
              }`
            }
          >
            <item.icon className="w-6 h-6 mb-0.5" strokeWidth={1.75} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
