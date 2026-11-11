import React from 'react';

interface TrophyProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const ChampionTrophy: React.FC<TrophyProps> = ({ className = '', size = 180, glow = true }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <div
          className="absolute inset-0 rounded-full bg-amber-400/20 blur-2xl pointer-events-none scale-125 animate-pulse"
          style={{ width: size, height: size }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_12px_24px_rgba(245,196,81,0.25)]"
      >
        <defs>
          {/* Gold Metallic Gradients */}
          <linearGradient id="goldCupBody" x1="40" y1="30" x2="200" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF3B0" />
            <stop offset="25%" stopColor="#F5C451" />
            <stop offset="55%" stopColor="#D99B26" />
            <stop offset="85%" stopColor="#FFDE72" />
            <stop offset="100%" stopColor="#966607" />
          </linearGradient>

          <linearGradient id="goldHighlight" x1="120" y1="20" x2="120" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#F5C451" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#7E5205" stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id="goldRim" x1="60" y1="20" x2="180" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E5A620" />
            <stop offset="30%" stopColor="#FFF2A3" />
            <stop offset="70%" stopColor="#F5C451" />
            <stop offset="100%" stopColor="#8A5A05" />
          </linearGradient>

          <linearGradient id="goldBase" x1="70" y1="180" x2="170" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2A1B02" />
            <stop offset="20%" stopColor="#6C4505" />
            <stop offset="50%" stopColor="#D49925" />
            <stop offset="80%" stopColor="#FFEAA0" />
            <stop offset="100%" stopColor="#3A2403" />
          </linearGradient>

          {/* Violet Gemstone Gradient */}
          <radialGradient id="gemViolet" cx="45%" cy="40%" r="55%" fx="35%" fy="30%">
            <stop offset="0%" stopColor="#E9D5FF" />
            <stop offset="35%" stopColor="#A855F7" />
            <stop offset="75%" stopColor="#6B21A8" />
            <stop offset="100%" stopColor="#3B0764" />
          </radialGradient>

          {/* Radial Sheen */}
          <radialGradient id="gemAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Halo Behind Cup */}
        <circle cx="120" cy="85" r="55" fill="url(#gemAura)" />

        {/* Handles */}
        <path
          d="M62 48 C20 48, 16 112, 68 116 C60 98, 64 66, 75 58 Z"
          fill="url(#goldCupBody)"
          stroke="#FFE685"
          strokeWidth="1.5"
        />
        <path
          d="M178 48 C220 48, 224 112, 172 116 C180 98, 176 66, 165 58 Z"
          fill="url(#goldCupBody)"
          stroke="#FFE685"
          strokeWidth="1.5"
        />

        {/* Cup Outer Shell */}
        <path
          d="M60 28 C60 28, 62 120, 120 135 C178 120, 180 28, 180 28 Z"
          fill="url(#goldCupBody)"
          stroke="#FFEBA0"
          strokeWidth="1"
        />

        {/* Cup Inner Highlight Curve */}
        <path
          d="M72 32 C72 32, 74 112, 120 126 C166 112, 168 32, 168 32 Z"
          fill="url(#goldHighlight)"
        />

        {/* Cup Top Rim Ellipse */}
        <ellipse cx="120" cy="28" rx="60" ry="10" fill="url(#goldRim)" stroke="#FFF6BD" strokeWidth="1.5" />
        <ellipse cx="120" cy="28" rx="54" ry="7" fill="#4B3206" />

        {/* Trophy Stem & Neck */}
        <path
          d="M106 133 L134 133 L130 170 L110 170 Z"
          fill="url(#goldCupBody)"
          stroke="#C88E1B"
          strokeWidth="1"
        />
        <ellipse cx="120" cy="150" rx="16" ry="4" fill="#FFE580" />

        {/* Tiered Pedestal Base */}
        <path d="M96 170 L144 170 L152 188 L88 188 Z" fill="url(#goldBase)" stroke="#F5C451" strokeWidth="1" />
        <rect x="76" y="188" width="88" height="20" rx="3" fill="#18181B" stroke="#F5C451" strokeWidth="1.5" />
        <rect x="68" y="208" width="104" height="12" rx="4" fill="url(#goldBase)" stroke="#FFEAA0" strokeWidth="1" />

        {/* Engraved Plaque on Base */}
        <rect x="84" y="193" width="72" height="10" rx="2" fill="url(#goldCupBody)" />
        <text
          x="120"
          y="201"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="900"
          fill="#3B2302"
          letterSpacing="0.8"
          fontFamily="system-ui, sans-serif"
        >
          ETHSHALA #1
        </text>

        {/* Central Violet Gemstone Mount */}
        <circle cx="120" cy="78" r="22" fill="#2E1065" stroke="#FFE78B" strokeWidth="2" />
        <polygon
          points="120,60 136,70 136,88 120,98 104,88 104,70"
          fill="url(#gemViolet)"
          stroke="#E9D5FF"
          strokeWidth="1.2"
        />

        {/* Ethereum Diamond inside Gemstone */}
        <polygon points="120,66 128,78 120,83 112,78" fill="#FFFFFF" fillOpacity="0.9" />
        <polygon points="120,84 128,80 120,92 112,80" fill="#E9D5FF" fillOpacity="0.75" />

        {/* Shimmer Sparkles */}
        <polygon points="152,42 155,48 161,51 155,54 152,60 149,54 143,51 149,48" fill="#FFFFFF" opacity="0.9" />
        <polygon points="85,65 87,70 92,72 87,74 85,79 83,74 78,72 83,70" fill="#FFF275" opacity="0.8" />
      </svg>
    </div>
  );
};
