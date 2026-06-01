import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import Logo from '../components/common/Logo.jsx';
import * as authService from '../services/authService.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success('If an account exists, instructions have been sent.');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-navy px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,182,212,0.3), transparent),
            radial-gradient(circle at 0% 100%, rgba(20,184,166,0.2), transparent 50%)`,
        }}
      />
      <Link
        to="/login"
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 text-sm text-teal-200 hover:text-white md:left-8 md:top-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Link>
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl md:p-10 space-y-6"
      >
        <div className="text-center">
          <div className="flex justify-center">
            <Logo showText variant="light" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-semibold text-white md:text-3xl">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            We&apos;ll email you a link if your account exists.
          </p>
        </div>
        <Input
          variant="glass"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" variant="premium" className="w-full py-3.5 font-heading" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </Button>
        <p className="text-center text-sm text-slate-400">
          <Link to="/login" className="font-semibold text-teal-300 hover:text-teal-200">
            Back to login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
