/**
 * Empty State Illustration
 * Flat vector SVG for empty states (no tanks yet, no activity).
 * Shows a simple aquarium outline with a plus icon.
 */
export function EmptyStateIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Aquarium outline */}
      <rect
        x="40"
        y="30"
        width="120"
        height="90"
        rx="12"
        stroke="#0D9488"
        strokeWidth="3"
        strokeDasharray="8 4"
        opacity="0.4"
      />

      {/* Water level inside */}
      <path
        d="M46 60C60 55 80 65 100 58C120 51 140 62 154 57V114C154 117.3 151.3 120 148 120H52C48.7 120 46 117.3 46 114V60Z"
        fill="#5EEAD4"
        opacity="0.1"
      />

      {/* Small fish silhouette */}
      <g transform="translate(85, 85)" opacity="0.3">
        <ellipse cx="0" cy="0" rx="12" ry="7" fill="#0D9488" />
        <polygon points="-12,0 -18,-5 -18,5" fill="#0D9488" />
        <circle cx="5" cy="-1" r="2" fill="#F0FDFA" />
      </g>

      {/* Plus icon */}
      <circle cx="100" cy="75" r="18" fill="#0D9488" opacity="0.15" />
      <line x1="100" y1="65" x2="100" y2="85" stroke="#0D9488" strokeWidth="3" strokeLinecap="round" />
      <line x1="90" y1="75" x2="110" y2="75" stroke="#0D9488" strokeWidth="3" strokeLinecap="round" />

      {/* Bubbles */}
      <circle cx="70" cy="50" r="3" fill="#5EEAD4" opacity="0.3" />
      <circle cx="130" cy="45" r="2" fill="#5EEAD4" opacity="0.2" />
      <circle cx="75" cy="40" r="1.5" fill="#5EEAD4" opacity="0.15" />

      {/* Sand hint at bottom */}
      <path
        d="M46 114C60 112 80 116 100 113C120 110 140 115 154 112V114C154 117.3 151.3 120 148 120H52C48.7 120 46 117.3 46 114Z"
        fill="#FCD34D"
        opacity="0.2"
      />
    </svg>
  )
}
