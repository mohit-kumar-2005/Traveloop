import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm.jsx';
import Logo from '../components/common/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { UNSPLASH } from '../data/landingContent.js';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate('/dashboard', { replace: true });
    } catch (e) {
      toast.error(e.friendlyMessage || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative hidden overflow-hidden lg:block"
      >
        <img
          src={UNSPLASH.auth}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/55 to-cyan-900/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-transparent to-teal-400/5" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-white/90 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="max-w-md">
            <p className="font-heading text-sm uppercase tracking-[0.2em] text-teal-200">Traveloop</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight">
              Welcome back, explorer.
            </h2>
            <p className="mt-4 text-lg text-white/85 leading-relaxed">
              Your itineraries, budgets, and notes — synced and ready for the next adventure.
            </p>
          </div>
          <p className="text-sm text-white/50">© {new Date().getFullYear()} Traveloop</p>
        </div>
      </motion.div>

      <div className="relative flex min-h-screen flex-col justify-center bg-navy px-4 py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(20,184,166,0.35), transparent),
              radial-gradient(circle at 100% 100%, rgba(6,182,212,0.2), transparent 50%)`,
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mx-auto w-full max-w-md"
        >
          <div className="mb-8 lg:hidden">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-teal-200 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
            <div className="mb-8 text-center">
              <div className="flex justify-center">
                <Logo showText size="lg" variant="light" />
              </div>
              <p className="mt-3 text-slate-300">Sign in to continue your journey</p>
            </div>
            <LoginForm onSubmit={handleLogin} variant="glass" />
            {loading && <p className="mt-3 text-center text-xs text-slate-400">Signing you in…</p>}
          </div>
          <p className="mt-8 text-center text-sm text-slate-400">
            New here?{' '}
            <Link to="/signup" className="font-heading font-semibold text-teal-300 hover:text-teal-200">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
