export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email) errors.email = 'Email is required';
  else if (!emailRegex.test(email)) errors.email = 'Invalid email';
  if (!password) errors.password = 'Password is required';
  return errors;
}

export function validateSignup(data) {
  const errors = {};
  if (!data.name?.trim()) errors.name = 'Name is required';
  if (!data.email) errors.email = 'Email is required';
  else if (!emailRegex.test(data.email)) errors.email = 'Invalid email';
  if (!data.password || data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  return errors;
}

export function passwordStrength(password) {
  if (!password) return 0;
  let s = 0;
  if (password.length >= 8) s++;
  if (/[A-Z]/.test(password)) s++;
  if (/[0-9]/.test(password)) s++;
  if (/[^A-Za-z0-9]/.test(password)) s++;
  return s;
}
