import React from 'react';

interface TrophyProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const ThirdPlaceTrophy: React.FC<TrophyProps> = ({ className = '', size = 140, glow = true }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <div
          className="absolute inset-0 rounded-full bg-amber-600/20 blur-xl pointer-events-none scale-110"
          style={{ width: size, height: size }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_8px_20px_rgba(180,83,9,0.25)]"
      >
        <defs>
          <linearGradient id="bronzeCupBody" x1="40" y1="30" x2="200" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="25%" stopColor="#D97706" />
            <stop offset="60%" stopColor="#92400E" />
            <stop offset="85%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          <linearGradient id="bronzeHighlight" x1="120" y1="20" x2="120" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#B45309" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#451A03" stopOpacity="0.6" />
          </linearGradient>

          <radialGradient id="gemOrange" cx="45%" cy="40%" r="55%" fx="35%" fy="30%">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="35%" stopColor="#F97316" />
            <stop offset="75%" stopColor="#C2410C" />
            <stop offset="100%" stopColor="#7C2D12" />
          </radialGradient>
        </defs>

        {/* Handles */}
        <path
          d="M68 54 C32 54, 28 106, 74 110 C66 94, 70 68, 79 62 Z"
          fill="url(#bronzeCupBody)"
          stroke="#FCD34D"
          strokeWidth="1.5"
        />
        <path
          d="M172 54 C208 54, 212 106, 166 110 C174 94, 170 68, 161 62 Z"
          fill="url(#bronzeCupBody)"
          stroke="#FCD34D"
          strokeWidth="1.5"
        />

        {/* Cup Body */}
        <path
          d="M68 34 C68 34, 70 116, 120 130 C170 116, 172 34, 172 34 Z"
          fill="url(#bronzeCupBody)"
          stroke="#FDE68A"
          strokeWidth="1"
        />

        {/* Highlight */}
        <path
          d="M78 38 C78 38, 80 110, 120 122 C160 110, 162 38, 162 38 Z"
          fill="url(#bronzeHighlight)"
        />

        {/* Rim */}
        <ellipse cx="120" cy="34" rx="52" ry="8" fill="url(#bronzeCupBody)" stroke="#FEF3C7" strokeWidth="1.5" />
        <ellipse cx="120" cy="34" rx="46" ry="5" fill="#2E1005" />

        {/* Stem */}
        <path d="M109 129 L131 129 L127 166 L113 166 Z" fill="url(#bronzeCupBody)" stroke="#78350F" strokeWidth="1" />
        <ellipse cx="120" cy="146" rx="13" ry="3.5" fill="#FDE68A" />

        {/* Pedestal Base */}
        <path d="M101 166 L139 166 L146 184 L94 184 Z" fill="url(#bronzeCupBody)" stroke="#B45309" strokeWidth="1" />
        <rect x="82" y="184" width="76" height="18" rx="3" fill="#18181B" stroke="#92400E" strokeWidth="1.5" />
        <rect x="74" y="202" width="92" height="12" rx="4" fill="url(#bronzeCupBody)" stroke="#FDE68A" strokeWidth="1" />

        {/* Engraved Plaque */}
        <rect x="89" y="188" width="62" height="9" rx="2" fill="url(#bronzeCupBody)" />
        <text
          x="120"
          y="195"
          textAnchor="middle"
          fontSize="6"
          fontWeight="900"
          fill="#2A1205"
          letterSpacing="0.8"
          fontFamily="system-ui, sans-serif"
        >
          3RD PLACE
        </text>

        {/* Central Orange Gemstone Mount */}
        <circle cx="120" cy="78" r="18" fill="#431407" stroke="#FDE68A" strokeWidth="1.8" />
        <polygon
          points="120,63 133,71 133,86 120,94 107,86 107,71"
          fill="url(#gemOrange)"
          stroke="#FED7AA"
          strokeWidth="1.2"
        />

        {/* Ethereum Diamond inside Gemstone */}
        <polygon points="120,69 125,78 120,82 115,78" fill="#FFFFFF" fillOpacity="0.9" />
        <polygon points="120,83 125,80 120,89 115,80" fill="#FFEDD5" fillOpacity="0.8" />
      </svg>
    </div>
  );
};
