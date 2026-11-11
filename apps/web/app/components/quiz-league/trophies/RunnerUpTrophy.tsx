import React from 'react';

interface TrophyProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const RunnerUpTrophy: React.FC<TrophyProps> = ({ className = '', size = 150, glow = true }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <div
          className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl pointer-events-none scale-110"
          style={{ width: size, height: size }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_8px_20px_rgba(148,163,184,0.3)]"
      >
        <defs>
          <linearGradient id="silverCupBody" x1="40" y1="30" x2="200" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#CBD5E1" />
            <stop offset="60%" stopColor="#94A3B8" />
            <stop offset="85%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          <linearGradient id="silverHighlight" x1="120" y1="20" x2="120" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#94A3B8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0.5" />
          </linearGradient>

          <radialGradient id="gemBlue" cx="45%" cy="40%" r="55%" fx="35%" fy="30%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="35%" stopColor="#38BDF8" />
            <stop offset="75%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#075985" />
          </radialGradient>
        </defs>

        {/* Handles */}
        <path
          d="M66 52 C28 52, 24 108, 72 112 C64 96, 68 68, 77 60 Z"
          fill="url(#silverCupBody)"
          stroke="#F1F5F9"
          strokeWidth="1.5"
        />
        <path
          d="M174 52 C212 52, 216 108, 168 112 C176 96, 172 68, 163 60 Z"
          fill="url(#silverCupBody)"
          stroke="#F1F5F9"
          strokeWidth="1.5"
        />

        {/* Cup Outer Shell */}
        <path
          d="M66 32 C66 32, 68 118, 120 132 C172 118, 174 32, 174 32 Z"
          fill="url(#silverCupBody)"
          stroke="#FFFFFF"
          strokeWidth="1"
        />

        {/* Inner Highlight */}
        <path
          d="M76 36 C76 36, 78 112, 120 124 C162 112, 164 36, 164 36 Z"
          fill="url(#silverHighlight)"
        />

        {/* Cup Top Rim */}
        <ellipse cx="120" cy="32" rx="54" ry="9" fill="url(#silverCupBody)" stroke="#FFFFFF" strokeWidth="1.5" />
        <ellipse cx="120" cy="32" rx="48" ry="6" fill="#1E293B" />

        {/* Stem */}
        <path d="M108 131 L132 131 L128 168 L112 168 Z" fill="url(#silverCupBody)" stroke="#64748B" strokeWidth="1" />
        <ellipse cx="120" cy="148" rx="14" ry="4" fill="#F8FAFC" />

        {/* Pedestal Base */}
        <path d="M100 168 L140 168 L148 186 L92 186 Z" fill="url(#silverCupBody)" stroke="#CBD5E1" strokeWidth="1" />
        <rect x="80" y="186" width="80" height="18" rx="3" fill="#18181B" stroke="#94A3B8" strokeWidth="1.5" />
        <rect x="72" y="204" width="96" height="12" rx="4" fill="url(#silverCupBody)" stroke="#FFFFFF" strokeWidth="1" />

        {/* Engraved Plaque */}
        <rect x="88" y="190" width="64" height="9" rx="2" fill="url(#silverCupBody)" />
        <text
          x="120"
          y="197"
          textAnchor="middle"
          fontSize="6"
          fontWeight="900"
          fill="#0F172A"
          letterSpacing="0.8"
          fontFamily="system-ui, sans-serif"
        >
          2ND PLACE
        </text>

        {/* Central Blue Gemstone Mount */}
        <circle cx="120" cy="78" r="19" fill="#0C4A6E" stroke="#E2E8F0" strokeWidth="1.8" />
        <polygon
          points="120,62 134,71 134,87 120,95 106,87 106,71"
          fill="url(#gemBlue)"
          stroke="#BAE6FD"
          strokeWidth="1.2"
        />

        {/* Ethereum Diamond inside Gemstone */}
        <polygon points="120,68 126,78 120,82 114,78" fill="#FFFFFF" fillOpacity="0.9" />
        <polygon points="120,83 126,80 120,90 114,80" fill="#E0F2FE" fillOpacity="0.8" />
      </svg>
    </div>
  );
};
