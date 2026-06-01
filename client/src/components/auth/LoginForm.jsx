import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { validateLogin } from '../../utils/validators.js';
import { cn } from '../../utils/helpers.js';

export default function LoginForm({ onSubmit, variant = 'default' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const glass = variant === 'glass';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateLogin({ email, password });
    setErrors(v);
    if (Object.keys(v).length) return;
    await onSubmit({ email, password });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input
        variant={glass ? 'glass' : 'default'}
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <div>
        <label
          className={cn('block text-sm font-medium mb-1.5', glass ? 'text-slate-200' : 'text-slate-700')}
        >
          Password
        </label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            className={cn(
              'w-full rounded-xl px-4 py-3 pr-12 transition-all outline-none',
              glass
                ? 'border border-white/20 bg-white/10 text-white placeholder:text-slate-400 focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/30'
                : 'border border-slate-200 focus:ring-2 focus:ring-teal-400'
            )}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center',
              glass ? 'text-slate-300' : 'text-muted'
            )}
            onClick={() => setShow(!show)}
          >
            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className={cn('text-xs mt-1 animate-shake', glass ? 'text-red-300' : 'text-red-500')}>
            {errors.password}
          </p>
        )}
      </div>
      <Button type="submit" variant={glass ? 'premium' : 'primary'} className="w-full py-3.5 font-heading">
        Sign In
      </Button>
      <div className={cn('flex justify-between text-sm', glass ? 'text-slate-300' : '')}>
        <Link
          to="/forgot-password"
          className={glass ? 'text-teal-300 hover:underline' : 'text-primary-dark hover:underline'}
        >
          Forgot password?
        </Link>
        <Link
          to="/signup"
          className={cn('font-semibold hover:underline', glass ? 'text-white' : 'text-primary-dark')}
        >
          Create account
        </Link>
      </div>
    </motion.form>
  );
}
