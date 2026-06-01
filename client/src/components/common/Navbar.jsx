import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, Menu, Search, MapPinned, User, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import Logo from './Logo.jsx';
import Avatar from './Avatar.jsx';

export default function Navbar({ variant = 'app', onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to Traveloop!", time: "Just now" }
  ]);

  useEffect(() => {
    // Simulate realtime notifications
    const timer = setInterval(() => {
      setNotifications(prev => [
        { id: Date.now(), text: "Someone liked your trip!", time: "Just now" },
        ...prev.map(n => ({...n, time: "A while ago"})).slice(0, 4)
      ]);
    }, 45000); // New notification every 45 seconds
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const shell =
    variant === 'auth'
      ? 'bg-transparent'
      : scrolled
        ? 'bg-dark shadow-md'
        : 'bg-dark';

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-40 transition-all ${shell}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <button
          type="button"
          className="lg:hidden text-white p-2 rounded-xl hover:bg-white/10 min-w-[44px] min-h-[44px]"
          onClick={onMenuClick}
          aria-label="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/dashboard" className={`flex items-center gap-2 text-white ${variant === 'app' ? 'lg:hidden' : ''}`}>
          <Logo showText />
        </Link>
        {variant === 'app' && (
          <>
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  placeholder="Search trips, cities..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter')
                      navigate(`/cities?search=${encodeURIComponent(e.target.value)}`);
                  }}
                />
              </div>
            </div>
            <button
              type="button"
              className="md:hidden text-white p-2 rounded-xl hover:bg-white/10"
              aria-label="Search"
              onClick={() => navigate('/cities')}
            >
              <Search className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowNotifications(!showNotifications); setOpen(false); }}
                  className="relative p-2 rounded-xl hover:bg-white/10 text-white min-w-[44px] min-h-[44px]"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 max-h-80 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-slate-100 font-bold text-slate-800">Notifications</div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-500">No new notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50">
                          <p className="text-sm text-slate-800">{n.text}</p>
                          <p className="text-xs text-muted mt-1">{n.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setOpen(!open); setShowNotifications(false); }}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/10"
                >
                  <Avatar src={user?.photo} name={user?.name} />
                </button>
                {open && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                    <NavLink
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"
                      onClick={() => setOpen(false)}
                    >
                      <User className="w-4 h-4" /> Profile
                    </NavLink>
                    <NavLink
                      to="/trips"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"
                      onClick={() => setOpen(false)}
                    >
                      <MapPinned className="w-4 h-4" /> My Trips
                    </NavLink>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 text-left"
                      onClick={() => {
                        setOpen(false);
                        logout();
                      }}
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {variant === 'app' && user?.role === 'admin' && (
        <div className="hidden lg:block border-t border-white/10 px-4 py-1">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1 text-xs text-teal-200 hover:text-white"
          >
            Admin console →
          </Link>
        </div>
      )}
    </motion.header>
  );
}
