export default function Avatar({ src, name, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' };
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`}
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={`${sizes[size]} rounded-full bg-primary/20 text-primary-dark font-bold flex items-center justify-center`}
    >
      {initials}
    </div>
  );
}
