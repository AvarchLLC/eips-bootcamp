import React from 'react';

interface BadgeProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const PerfectScoreBadge: React.FC<BadgeProps> = ({ className = '', size = 96, glow = true }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <div
          className="absolute inset-0 rounded-full bg-amber-400/25 blur-xl pointer-events-none scale-125"
          style={{ width: size, height: size }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_8px_16px_rgba(245,196,81,0.3)]"
      >
        <defs>
          <linearGradient id="psGoldRim" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF7C2" />
            <stop offset="35%" stopColor="#F5C451" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <linearGradient id="psInnerBg" x1="40" y1="40" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#27272A" />
            <stop offset="100%" stopColor="#09090B" />
          </linearGradient>

          <linearGradient id="psLightning" x1="60" y1="30" x2="100" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FDE047" />
            <stop offset="80%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>

        {/* Outer Starburst Rays */}
        <g stroke="#F5C451" strokeWidth="1.5" strokeOpacity="0.4">
          <line x1="80" y1="8" x2="80" y2="20" />
          <line x1="80" y1="140" x2="80" y2="152" />
          <line x1="8" y1="80" x2="20" y2="80" />
          <line x1="140" y1="80" x2="152" y2="80" />
          <line x1="28" y1="28" x2="37" y2="37" />
          <line x1="123" y1="123" x2="132" y2="132" />
          <line x1="28" y1="132" x2="37" y2="123" />
          <line x1="123" y1="37" x2="132" y2="28" />
        </g>

        {/* Outer Gold Beaded Ring */}
        <circle cx="80" cy="80" r="62" fill="url(#psGoldRim)" />
        <circle cx="80" cy="80" r="54" fill="url(#psInnerBg)" stroke="#FDE047" strokeWidth="2" strokeDasharray="4 2" />

        {/* Inner Radial Glow */}
        <circle cx="80" cy="80" r="42" fill="#854D0E" fillOpacity="0.25" />

        {/* Stylized Lightning Bolt */}
        <path
          d="M86 34 L56 82 L76 82 L70 126 L104 74 L84 74 Z"
          fill="url(#psLightning)"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Centered Sparkles */}
        <circle cx="98" cy="62" r="3" fill="#FFFFFF" />
        <circle cx="62" cy="98" r="2" fill="#FDE047" />
      </svg>
    </div>
  );
};

export const StreakBadge: React.FC<BadgeProps> = ({ className = '', size = 96, glow = true }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <div
          className="absolute inset-0 rounded-full bg-violet-500/25 blur-xl pointer-events-none scale-125"
          style={{ width: size, height: size }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_8px_16px_rgba(139,92,246,0.35)]"
      >
        <defs>
          <linearGradient id="purpleFlame" x1="80" y1="20" x2="80" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F5D0FE" />
            <stop offset="25%" stopColor="#C084FC" />
            <stop offset="60%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>

          <linearGradient id="innerFlameCore" x1="80" y1="60" x2="80" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#E879F9" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          <linearGradient id="badgeBorder" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#581C87" />
          </linearGradient>
        </defs>

        {/* Circular Shield Backing */}
        <circle cx="80" cy="80" r="64" fill="#18181B" stroke="url(#badgeBorder)" strokeWidth="2.5" />
        <circle cx="80" cy="80" r="56" fill="#09090B" stroke="#7C3AED" strokeWidth="1" strokeOpacity="0.4" />

        {/* Outer Flame Wings */}
        <path
          d="M80 22 C92 48, 122 72, 122 98 C122 124, 102 138, 80 138 C58 138, 38 124, 38 98 C38 72, 68 48, 80 22 Z"
          fill="url(#purpleFlame)"
          stroke="#E9D5FF"
          strokeWidth="1"
        />

        {/* Middle Flame Crest */}
        <path
          d="M80 50 C90 68, 108 84, 108 102 C108 120, 96 130, 80 130 C64 130, 52 120, 52 102 C52 84, 70 68, 80 50 Z"
          fill="url(#innerFlameCore)"
          opacity="0.9"
        />

        {/* Inner White-Hot Core */}
        <path
          d="M80 82 C86 92, 94 102, 94 112 C94 122, 88 126, 80 126 C72 126, 66 122, 66 112 C66 102, 74 92, 80 82 Z"
          fill="#FFFFFF"
        />

        {/* Number 7 Emblem */}
        <text
          x="80"
          y="114"
          textAnchor="middle"
          fontSize="18"
          fontWeight="900"
          fill="#581C87"
          fontFamily="system-ui, sans-serif"
        >
          7
        </text>
      </svg>
    </div>
  );
};

export const QuizMasterBadge: React.FC<BadgeProps> = ({ className = '', size = 96, glow = true }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <div
          className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl pointer-events-none scale-125"
          style={{ width: size, height: size }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_8px_16px_rgba(245,196,81,0.3)]"
      >
        <defs>
          <linearGradient id="qmGold" x1="30" y1="30" x2="130" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="40%" stopColor="#F5C451" />
            <stop offset="80%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>

        {/* Octagonal Crest */}
        <polygon
          points="80,16 126,34 144,80 126,126 80,144 34,126 16,80 34,34"
          fill="#18181B"
          stroke="url(#qmGold)"
          strokeWidth="3"
        />

        {/* Inner Octagon */}
        <polygon
          points="80,26 118,41 133,80 118,119 80,134 42,119 27,80 42,41"
          fill="#09090B"
          stroke="#FDE047"
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        {/* Mortarboard / Scholar Cap */}
        <polygon points="80,48 120,64 80,80 40,64" fill="url(#qmGold)" stroke="#FFFBEB" strokeWidth="1" />
        <path d="M58 72 L58 92 C58 100, 102 100, 102 92 L102 72 Z" fill="#D97706" stroke="#FEF08A" strokeWidth="1" />
        <path d="M120 64 L120 90" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
        <circle cx="120" cy="94" r="3.5" fill="#FEF08A" />

        {/* Laurels / Ribbon */}
        <path d="M54 116 C66 122, 94 122, 106 116" stroke="url(#qmGold)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="80" cy="116" r="4" fill="#F5C451" />
      </svg>
    </div>
  );
};

export const EthshalaScholarBadge: React.FC<BadgeProps> = ({ className = '', size = 96, glow = true }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {glow && (
        <div
          className="absolute inset-0 rounded-full bg-violet-400/25 blur-xl pointer-events-none scale-125"
          style={{ width: size, height: size }}
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_8px_20px_rgba(139,92,246,0.35)]"
      >
        <defs>
          <linearGradient id="ethDiamondTop" x1="80" y1="36" x2="80" y2="88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>

          <linearGradient id="ethDiamondBot" x1="80" y1="92" x2="80" y2="124" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E9D5FF" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>

          <linearGradient id="sealBorder" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F5C451" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* Hexagonal Shield */}
        <polygon
          points="80,14 136,46 136,114 80,146 24,114 24,46"
          fill="#111114"
          stroke="url(#sealBorder)"
          strokeWidth="2.5"
        />

        <polygon
          points="80,24 126,51 126,109 80,136 34,109 34,51"
          fill="#18181B"
          stroke="#8B5CF6"
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Ethereum Octahedron Symbol */}
        {/* Top Pyramids */}
        <polygon points="80,36 106,78 80,90" fill="url(#ethDiamondTop)" fillOpacity="0.95" />
        <polygon points="80,36 54,78 80,90" fill="#A855F7" fillOpacity="0.75" />
        <polygon points="80,90 106,78 80,68" fill="#F3E8FF" fillOpacity="0.9" />
        <polygon points="80,90 54,78 80,68" fill="#9333EA" fillOpacity="0.65" />

        {/* Bottom Inverted Pyramids */}
        <polygon points="80,94 106,82 80,124" fill="url(#ethDiamondBot)" fillOpacity="0.95" />
        <polygon points="80,94 54,82 80,124" fill="#6B21A8" fillOpacity="0.8" />
      </svg>
    </div>
  );
};

