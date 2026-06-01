export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatDateRange(start, end) {
  if (!start || !end) return '';
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString()} — ${e.toLocaleDateString()}`;
}

export function debounce(fn, ms = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function getTripDays(start, end) {
  if (!start || !end) return 1;
  const d = Math.ceil((new Date(end) - new Date(start)) / 86400000) + 1;
  return Math.max(1, d);
}

export function eachDayBetween(start, end) {
  const days = [];
  let cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}
