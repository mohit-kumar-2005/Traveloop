import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../common/Navbar.jsx';
import Sidebar from '../common/Sidebar.jsx';
import BottomNav from '../common/BottomNav.jsx';
import Footer from '../common/Footer.jsx';

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar variant="app" onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 overflow-x-hidden max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
        <Footer />
        <BottomNav />
      </div>
    </div>
  );
}
