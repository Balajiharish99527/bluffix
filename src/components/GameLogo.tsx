"use client";

import React from "react";

export const GameLogo: React.FC<{ size?: number; className?: string }> = ({
  size = 200,
  className = "",
}) => {
  return (
    <svg
      viewBox="0 0 512 400"
      width={size}
      height={size * 0.78}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#1a1040" }} />
          <stop offset="100%" style={{ stopColor: "#2d1b69" }} />
        </linearGradient>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#fbbf24" }} />
          <stop offset="100%" style={{ stopColor: "#f59e0b" }} />
        </linearGradient>
        <linearGradient id="logoPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#7c3aed" }} />
          <stop offset="100%" style={{ stopColor: "#a855f7" }} />
        </linearGradient>
        <filter id="logoShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      <rect width="512" height="400" rx="24" fill="url(#logoBg)" />

      <circle
        cx="256"
        cy="120"
        r="65"
        fill="none"
        stroke="url(#logoGold)"
        strokeWidth="5"
        filter="url(#logoShadow)"
      />
      <circle cx="256" cy="120" r="48" fill="none" stroke="#7c3aed" strokeWidth="2.5" opacity="0.6" />
      <circle cx="256" cy="120" r="30" fill="none" stroke="url(#logoGold)" strokeWidth="1.5" opacity="0.4" />
      <circle cx="256" cy="120" r="12" fill="url(#logoGold)" filter="url(#logoShadow)" />

      <line
        x1="310"
        y1="55"
        x2="358"
        y2="7"
        stroke="url(#logoGold)"
        strokeWidth="7"
        strokeLinecap="round"
        filter="url(#logoShadow)"
      />
      <rect
        x="334"
        y="-12"
        width="42"
        height="42"
        rx="6"
        fill="none"
        stroke="url(#logoGold)"
        strokeWidth="5"
        transform="rotate(45, 355, 9)"
        filter="url(#logoShadow)"
      />

      <ellipse cx="224" cy="138" rx="6" ry="5" fill="url(#logoGold)" opacity="0.8" />
      <ellipse cx="288" cy="138" rx="6" ry="5" fill="url(#logoGold)" opacity="0.8" />
      <path
        d="M234 150 Q256 162 278 150"
        fill="none"
        stroke="url(#logoGold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />

      <text
        x="256"
        y="250"
        textAnchor="middle"
        fontFamily="Arial Black, Impact, sans-serif"
        fontSize="68"
        fontWeight="900"
        fill="url(#logoGold)"
        filter="url(#logoShadow)"
        letterSpacing="4"
      >
        BLUFFIX
      </text>

      <text
        x="256"
        y="285"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="20"
        fill="#a78bfa"
        letterSpacing="8"
      >
        IMPOSTOR GAME
      </text>

      <circle cx="80" cy="60" r="2" fill="#a78bfa" opacity="0.4" />
      <circle cx="432" cy="50" r="2.5" fill="#a78bfa" opacity="0.3" />
      <circle cx="60" cy="280" r="1.5" fill="#7c3aed" opacity="0.3" />
      <circle cx="452" cy="260" r="2" fill="#a78bfa" opacity="0.35" />
      <circle cx="120" cy="370" r="1.5" fill="#7c3aed" opacity="0.25" />
      <circle cx="390" cy="380" r="2" fill="#a78bfa" opacity="0.25" />
    </svg>
  );
};
