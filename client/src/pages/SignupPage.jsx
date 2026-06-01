import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import SignupForm from '../components/auth/SignupForm.jsx';
import Logo from '../components/common/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { UNSPLASH } from '../data/landingContent.js';

export default function SignupPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleRegister = async (data) => {
    setLoading(true);
    try {
      await register(data);
      toast.success('Account created!');
      navigate('/dashboard', { replace: true });
    } catch (e) {
      toast.error(e.friendlyMessage || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative hidden overflow-hidden lg:block"
      >
        <img
          src={UNSPLASH.split}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-cyan-600/20" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="inline-flex w-fit items-center gap-2 text-sm text-white/90 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="max-w-lg">
            <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
              The world is wide — your plan should be too.
            </h2>
            <p className="mt-6 text-lg text-white/85 leading-relaxed">
              AI itineraries, collaborative stops, and budgets that stay one step ahead.
            </p>
          </div>
          <div className="flex gap-8 text-sm text-white/70">
            <div>
              <p className="font-display text-2xl font-bold text-white">150+</p>
              <p>Destinations</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">50K+</p>
              <p>Travelers</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative flex min-h-screen flex-col justify-center bg-navy px-4 py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: `radial-gradient(ellipse 70% 50% at 30% 20%, rgba(6,182,212,0.25), transparent),
              radial-gradient(circle at 100% 80%, rgba(20,184,166,0.2), transparent 45%)`,
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mx-auto w-full max-w-xl"
        >
          <div className="mb-6 lg:hidden">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-teal-200 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
            <div className="mb-6 text-center">
              <div className="flex justify-center">
                <Logo showText size="lg" variant="light" />
              </div>
              <p className="mt-3 text-slate-300">Create your Traveloop account</p>
            </div>
            <SignupForm onSubmit={handleRegister} variant="glass" />
            {loading && <p className="mt-3 text-center text-xs text-slate-400">Creating account…</p>}
          </div>
          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-heading font-semibold text-teal-300 hover:text-teal-200">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
