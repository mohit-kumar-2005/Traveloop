import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { validateSignup, passwordStrength } from '../../utils/validators.js';
import { cn } from '../../utils/helpers.js';

const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'France',
  'Japan',
  'Australia',
  'India',
  'Other',
];

const fieldGlass =
  'w-full rounded-xl px-4 py-3 outline-none border border-white/20 bg-white/10 text-white focus:ring-2 focus:ring-teal-400/30';
const fieldDefault =
  'w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-400';

export default function SignupForm({ onSubmit, variant = 'default' }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [errors, setErrors] = useState({});

  const glass = variant === 'glass';
  const iv = glass ? 'glass' : 'default';
  const strength = useMemo(() => passwordStrength(password), [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = `${firstName} ${lastName}`.trim();
    const v = validateSignup({ name, email, password });
    setErrors(v);
    if (Object.keys(v).length) return;
    await onSubmit({
      name,
      email,
      password,
      phone,
      city,
      country,
      additionalInfo,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          variant={iv}
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={errors.name && !firstName ? errors.name : undefined}
        />
        <Input variant={iv} label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          variant={iv}
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input variant={iv} label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input variant={iv} label="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <div>
          <label
            className={cn('block text-sm font-medium mb-1', glass ? 'text-slate-200' : 'text-slate-700')}
          >
            Country
          </label>
          <select
            className={cn(glass ? fieldGlass : fieldDefault, 'text-inherit')}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="" className={glass ? 'bg-navy text-white' : ''}>
              Select country
            </option>
            {countries.map((c) => (
              <option key={c} value={c} className={glass ? 'bg-navy text-white' : ''}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label
          className={cn('block text-sm font-medium mb-1', glass ? 'text-slate-200' : 'text-slate-700')}
        >
          Password
        </label>
        <input
          type="password"
          className={cn(glass ? fieldGlass : fieldDefault)}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={cn(
                'h-1.5 flex-1 rounded-full',
                strength >= i ? 'bg-gradient-to-r from-teal-400 to-cyan-400' : glass ? 'bg-white/20' : 'bg-slate-200'
              )}
            />
          ))}
        </div>
        {errors.password && (
          <p className={cn('text-xs mt-1', glass ? 'text-red-300' : 'text-red-500')}>{errors.password}</p>
        )}
      </div>
      <div>
        <label
          className={cn('block text-sm font-medium mb-1', glass ? 'text-slate-200' : 'text-slate-700')}
        >
          Additional Information
        </label>
        <textarea
          rows={3}
          className={cn(glass ? fieldGlass : fieldDefault, 'resize-none')}
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
      </div>
      <Button type="submit" variant={glass ? 'premium' : 'primary'} className="w-full py-3.5 font-heading">
        Create account
      </Button>
      <p className={cn('text-center text-sm', glass ? 'text-slate-300' : 'text-slate-600')}>
        Already have an account?{' '}
        <Link to="/login" className={cn('font-semibold hover:underline', glass ? 'text-white' : 'text-primary-dark')}>
          Sign in
        </Link>
      </p>
    </motion.form>
  );
}
