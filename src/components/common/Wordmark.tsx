export default function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width="28" height="20" viewBox="0 0 28 20" aria-hidden="true" className="text-accent">
        <polyline
          points="1,11 8,11 10.5,3 14.5,18 17.5,7 20,11 27,11"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight">RunZones Lab</span>
    </span>
  );
}
