/**
 * Dashboard Hero Illustration
 * Flat vector SVG of an underwater scene in the Warm Aquatic palette.
 * Used as a decorative element in the dashboard greeting section.
 */
export function DashboardHeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Water background */}
      <rect width="240" height="160" rx="20" fill="#F0FDFA" />

      {/* Sand bottom */}
      <path
        d="M0 130C30 125 60 135 90 128C120 121 150 132 180 127C210 122 240 130 240 130V160H0V130Z"
        fill="#FCD34D"
        opacity="0.3"
      />

      {/* Coral reef left */}
      <path
        d="M20 130C20 130 25 105 35 108C45 111 40 95 50 98C60 101 55 115 55 115"
        stroke="#F97066"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="35" cy="103" r="8" fill="#F97066" opacity="0.5" />
      <circle cx="50" cy="95" r="6" fill="#F97066" opacity="0.4" />

      {/* Seaweed */}
      <path
        d="M70 130C70 130 68 110 72 100C76 90 65 85 70 75"
        stroke="#0D9488"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M80 130C80 130 82 115 78 105C74 95 85 90 80 80"
        stroke="#5EEAD4"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Fish 1 - main fish, teal */}
      <g transform="translate(130, 55)">
        <ellipse cx="0" cy="0" rx="18" ry="10" fill="#0D9488" />
        <polygon points="-18,0 -28,-8 -28,8" fill="#0D9488" />
        <circle cx="10" cy="-2" r="3" fill="white" />
        <circle cx="11" cy="-2" r="1.5" fill="#1E293B" />
        <ellipse cx="-5" cy="0" rx="4" ry="6" fill="#5EEAD4" opacity="0.4" />
      </g>

      {/* Fish 2 - small fish, coral */}
      <g transform="translate(180, 85)">
        <ellipse cx="0" cy="0" rx="12" ry="7" fill="#F97066" />
        <polygon points="-12,0 -19,-5 -19,5" fill="#F97066" />
        <circle cx="6" cy="-1" r="2" fill="white" />
        <circle cx="7" cy="-1" r="1" fill="#1E293B" />
      </g>

      {/* Fish 3 - tiny fish, gold */}
      <g transform="translate(100, 40)">
        <ellipse cx="0" cy="0" rx="8" ry="5" fill="#FCD34D" />
        <polygon points="-8,0 -13,-4 -13,4" fill="#FCD34D" />
        <circle cx="4" cy="-1" r="1.5" fill="white" />
        <circle cx="4.5" cy="-1" r="0.8" fill="#1E293B" />
      </g>

      {/* Bubbles */}
      <circle cx="140" cy="35" r="3" fill="#5EEAD4" opacity="0.4" />
      <circle cx="145" cy="25" r="2" fill="#5EEAD4" opacity="0.3" />
      <circle cx="138" cy="18" r="1.5" fill="#5EEAD4" opacity="0.2" />
      <circle cx="190" cy="70" r="2" fill="#5EEAD4" opacity="0.3" />
      <circle cx="185" cy="62" r="1.5" fill="#5EEAD4" opacity="0.2" />

      {/* Coral reef right */}
      <path
        d="M190 130C190 130 195 115 200 118C205 121 210 108 215 112C220 116 218 125 218 125"
        stroke="#6EE7B7"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Small stones on sand */}
      <ellipse cx="110" cy="135" rx="6" ry="3" fill="#E5E7EB" opacity="0.5" />
      <ellipse cx="155" cy="132" rx="4" ry="2" fill="#E5E7EB" opacity="0.4" />
    </svg>
  )
}
