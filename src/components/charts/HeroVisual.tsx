/** Decorative running-track lanes with a heartbeat trace. Replace with a licensed B&W photograph if desired. */
export default function HeroVisual() {
  return (
    <svg viewBox="0 0 480 360" className="h-auto w-full" aria-hidden="true" focusable="false">
      <g fill="none" stroke="#1B1B1A" strokeOpacity="0.28" strokeWidth="1">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M ${20 + i * 14} 350 C ${20 + i * 14} ${150 - i * 10}, 140 ${30 + i * 14}, 470 ${30 + i * 14}`} />
        ))}
      </g>
      <polyline
        points="0,235 120,235 142,235 158,185 176,285 196,140 220,300 238,235 480,235"
        fill="none"
        stroke="#C2410C"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
