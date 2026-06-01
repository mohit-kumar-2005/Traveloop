export default function MeshBackground({ children, className = '' }) {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-mesh"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-glow-cyan opacity-40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl"
        aria-hidden
      />
      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0v60H0' fill='none' stroke='%230E7490' stroke-opacity='0.06'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      {/* floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {[...Array(18)].map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-cyan-400/40"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23 + 10) % 100}%`,
              animation: `float ${5 + (i % 3)}s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
      {children}
    </div>
  );
}
