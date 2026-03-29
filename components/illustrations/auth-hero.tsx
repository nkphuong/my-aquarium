/**
 * Auth Hero Illustration
 * Flat vector SVG for the auth page split layout.
 * A warm underwater scene in teal/coral/gold.
 */
export function AuthHeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background circle */}
      <circle cx="200" cy="200" r="180" fill="#F0FDFA" />

      {/* Water */}
      <path
        d="M40 200C60 190 100 210 140 195C180 180 220 205 260 192C300 179 340 200 360 195V360C360 371 351 380 340 380H60C49 380 40 371 40 360V200Z"
        fill="#5EEAD4"
        opacity="0.15"
      />

      {/* Large coral formation */}
      <path
        d="M80 340C80 340 85 280 100 290C115 300 110 260 125 270C140 280 130 310 135 320"
        stroke="#F97066"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="100" cy="275" r="15" fill="#F97066" opacity="0.3" />
      <circle cx="125" cy="258" r="12" fill="#F97066" opacity="0.25" />

      {/* Seaweed cluster */}
      <path
        d="M280 340C280 340 275 290 285 270C295 250 270 240 280 220"
        stroke="#0D9488"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M300 340C300 340 305 300 295 280C285 260 310 250 300 230"
        stroke="#6EE7B7"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M260 340C260 340 258 310 265 295C272 280 255 275 262 260"
        stroke="#5EEAD4"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* Main fish - large, teal */}
      <g transform="translate(200, 240)">
        <ellipse cx="0" cy="0" rx="35" ry="20" fill="#0D9488" />
        <polygon points="-35,0 -52,-15 -52,15" fill="#0D9488" />
        <circle cx="18" cy="-4" r="6" fill="white" />
        <circle cx="20" cy="-4" r="3" fill="#1E293B" />
        <ellipse cx="-10" cy="0" rx="8" ry="12" fill="#5EEAD4" opacity="0.4" />
        {/* Fin */}
        <path d="M-5,-20 L5,-30 L15,-18" fill="#0D9488" opacity="0.7" />
      </g>

      {/* Medium fish - coral */}
      <g transform="translate(130, 280) scale(-1, 1)">
        <ellipse cx="0" cy="0" rx="22" ry="12" fill="#F97066" />
        <polygon points="-22,0 -32,-9 -32,9" fill="#F97066" />
        <circle cx="12" cy="-2" r="4" fill="white" />
        <circle cx="13" cy="-2" r="2" fill="#1E293B" />
        <path d="M-5,-12 L2,-20 L8,-10" fill="#F97066" opacity="0.7" />
      </g>

      {/* Small fish - gold */}
      <g transform="translate(280, 210)">
        <ellipse cx="0" cy="0" rx="14" ry="8" fill="#FCD34D" />
        <polygon points="-14,0 -22,-6 -22,6" fill="#FCD34D" />
        <circle cx="7" cy="-2" r="3" fill="white" />
        <circle cx="8" cy="-2" r="1.5" fill="#1E293B" />
      </g>

      {/* Tiny fish school */}
      <g opacity="0.6">
        <ellipse cx="170" cy="190" rx="8" ry="5" fill="#5EEAD4" />
        <polygon points="162,190 156,186 156,194" fill="#5EEAD4" />
        <ellipse cx="185" cy="185" rx="7" ry="4" fill="#5EEAD4" />
        <polygon points="178,185 173,182 173,188" fill="#5EEAD4" />
        <ellipse cx="175" cy="200" rx="6" ry="4" fill="#5EEAD4" />
        <polygon points="169,200 164,197 164,203" fill="#5EEAD4" />
      </g>

      {/* Bubbles */}
      <circle cx="210" cy="170" r="5" fill="#5EEAD4" opacity="0.3" />
      <circle cx="220" cy="155" r="3.5" fill="#5EEAD4" opacity="0.25" />
      <circle cx="205" cy="145" r="2.5" fill="#5EEAD4" opacity="0.2" />
      <circle cx="215" cy="130" r="2" fill="#5EEAD4" opacity="0.15" />
      <circle cx="140" cy="260" r="3" fill="#5EEAD4" opacity="0.2" />
      <circle cx="300" cy="190" r="2.5" fill="#5EEAD4" opacity="0.2" />

      {/* Sand bottom */}
      <path
        d="M40 340C80 332 120 345 160 335C200 325 240 340 280 332C320 324 360 338 360 338V360C360 371 351 380 340 380H60C49 380 40 371 40 360V340Z"
        fill="#FCD34D"
        opacity="0.25"
      />

      {/* Small stones */}
      <ellipse cx="150" cy="350" rx="10" ry="5" fill="#E5E7EB" opacity="0.3" />
      <ellipse cx="230" cy="345" rx="7" ry="3" fill="#E5E7EB" opacity="0.25" />
      <ellipse cx="320" cy="348" rx="8" ry="4" fill="#E5E7EB" opacity="0.2" />

      {/* Shell */}
      <g transform="translate(190, 348)">
        <ellipse cx="0" cy="0" rx="8" ry="5" fill="#F97066" opacity="0.3" />
        <path d="M-6,0 C-6,-4 -2,-6 0,-6 C2,-6 6,-4 6,0" stroke="#F97066" strokeWidth="1.5" opacity="0.4" fill="none" />
      </g>
    </svg>
  )
}
