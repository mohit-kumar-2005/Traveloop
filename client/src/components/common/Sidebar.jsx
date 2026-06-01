import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPinned,
  Compass,
  Users,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Logo from './Logo.jsx';

const items = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/trips', label: 'My Trips', icon: MapPinned },
  { to: '/cities', label: 'Explore Cities', icon: Compass },
  { to: '/activities', label: 'Activities', icon: Compass },
  { to: '/community', label: 'Community', icon: Users },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all min-h-[44px] ${
      isActive
        ? 'bg-teal-50 text-primary-dark border-l-4 border-primary font-medium'
        : 'text-slate-600 hover:bg-slate-50'
    } ${collapsed ? 'justify-center' : ''}`;

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-dark/40 z-40 lg:hidden"
          aria-label="Close menu"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-100 transition-all duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${collapsed ? 'w-16' : 'w-60'}`}
      >
        <div className="p-4 flex items-center justify-between">
          {!collapsed && <Logo size="sm" />}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-slate-100"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className={linkClass} onClick={onClose}>
              <Shield className="w-5 h-5 shrink-0" />
              {!collapsed && <span>Admin</span>}
            </NavLink>
          )}
        </nav>
        <div className="p-2 border-t border-slate-100 space-y-1">
          <button
            type="button"
            onClick={() => logout()}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 min-h-[44px]"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>
    </>
  );
}
