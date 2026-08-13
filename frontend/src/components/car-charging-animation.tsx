'use client';

export default function CarChargingAnimation({ energyKwh }: { energyKwh: number }) {
  return (
    <div className="relative flex items-center justify-center py-4" style={{ minHeight: '140px' }}>
      <svg viewBox="0 0 200 120" className="w-full max-w-[200px]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="carBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="carWindow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>
          <linearGradient id="lightning" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Energy pulse ring */}
        <circle cx="100" cy="55" r="50" fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0.3">
          <animate attributeName="r" values="50;55;50" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="55" r="42" fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0.2">
          <animate attributeName="r" values="42;48;42" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* Charging cable */}
        <path d="M 160 65 Q 170 65 170 55 L 170 40 Q 170 35 175 35" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
          <animate attributeName="d" values="M 160 65 Q 170 65 170 55 L 170 40 Q 170 35 175 35;M 160 65 Q 172 63 172 55 L 172 40 Q 172 35 177 35;M 160 65 Q 170 65 170 55 L 170 40 Q 170 35 175 35" dur="3s" repeatCount="indefinite" />
        </path>
        <circle cx="175" cy="35" r="4" fill="#374151">
          <animate attributeName="fill" values="#374151;#6b7280;#374151" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Car body */}
        <g>
          {/* Car shadow */}
          <ellipse cx="95" cy="88" rx="50" ry="5" fill="#000" opacity="0.3" />

          {/* Car base */}
          <path d="M 35 70 L 35 62 Q 35 58 40 58 L 140 58 Q 150 58 155 62 L 155 70 Z" fill="url(#carBody)" rx="5" />

          {/* Car roof */}
          <path d="M 55 58 L 65 38 Q 67 35 72 35 L 115 35 Q 120 35 122 38 L 135 58 Z" fill="url(#carBody)" />

          {/* Windows */}
          <path d="M 67 55 L 75 39 Q 76 37 79 37 L 95 37 L 95 55 Z" fill="url(#carWindow)" opacity="0.9" />
          <path d="M 97 55 L 97 37 L 113 37 Q 116 37 117 39 L 128 55 Z" fill="url(#carWindow)" opacity="0.9" />

          {/* Window shine */}
          <path d="M 68 53 L 76 39 L 78 39 L 71 53 Z" fill="#fff" opacity="0.1" />

          {/* Headlights */}
          <rect x="148" y="62" width="6" height="4" rx="1" fill="#fbbf24" filter="url(#glow)">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
          </rect>
          <rect x="36" y="62" width="6" height="4" rx="1" fill="#ef4444" opacity="0.6" />

          {/* Wheels */}
          <circle cx="60" cy="75" r="9" fill="#1f2937" stroke="#374151" strokeWidth="1" />
          <circle cx="60" cy="75" r="5" fill="#4b5563" />
          <circle cx="60" cy="75" r="2" fill="#6b7280" />

          <circle cx="130" cy="75" r="9" fill="#1f2937" stroke="#374151" strokeWidth="1" />
          <circle cx="130" cy="75" r="5" fill="#4b5563" />
          <circle cx="130" cy="75" r="2" fill="#6b7280" />

          {/* Wheel spin animation */}
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 60 75" to="360 60 75" dur="1s" repeatCount="indefinite" />
            <line x1="60" y1="70" x2="60" y2="80" stroke="#6b7280" strokeWidth="0.5" />
            <line x1="55" y1="75" x2="65" y2="75" stroke="#6b7280" strokeWidth="0.5" />
          </g>
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0 130 75" to="360 130 75" dur="1s" repeatCount="indefinite" />
            <line x1="130" y1="70" x2="130" y2="80" stroke="#6b7280" strokeWidth="0.5" />
            <line x1="125" y1="75" x2="135" y2="75" stroke="#6b7280" strokeWidth="0.5" />
          </g>
        </g>

        {/* Lightning bolt */}
        <g filter="url(#softGlow)">
          <path d="M 90 22 L 82 36 L 89 36 L 85 50 L 100 32 L 93 32 L 97 22 Z" fill="url(#lightning)">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
          </path>
        </g>

        {/* Energy particles flowing to car */}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} r="1.5" fill="#10b981" opacity="0.6" filter="url(#glow)">
            <animateMotion
              dur={`${1.5 + i * 0.3}s`}
              repeatCount="indefinite"
              begin={`${i * 0.3}s`}
              path="M 175 35 Q 165 45 160 58 Q 155 65 150 65"
            />
            <animate attributeName="r" values="0.5;2;0.5" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
            <animate attributeName="opacity" values="0;0.8;0" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
          </circle>
        ))}

        {/* Battery indicator on car */}
        <g transform="translate(70, 42)">
          <rect x="0" y="0" width="22" height="10" rx="2" fill="none" stroke="#374151" strokeWidth="0.8" />
          <rect x="22" y="3" width="2" height="4" rx="0.5" fill="#374151" />
          <rect x="2" y="2" width="0" height="6" rx="1" fill="#10b981">
            <animate attributeName="width" values="2;16;2" dur="3s" repeatCount="indefinite" />
          </rect>
        </g>
      </svg>

      {/* Energy display */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <p className="text-emerald-400 text-xs font-bold tracking-wider">
          {Number(energyKwh).toFixed(1)} kWh
        </p>
      </div>
    </div>
  );
}
