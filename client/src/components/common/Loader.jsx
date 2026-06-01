export default function Loader({ className = '' }) {
  return (
    <div className={`flex justify-center p-8 ${className}`}>
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
